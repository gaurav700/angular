# Angular Quick Reference — Parent⇄Child, Reuse Components, Pipes, Lifecycle Hooks

## Table of Contents

1. Parent → Child (Input)
2. Child → Parent (Output)
3. Reusing Components (Patterns & Techniques)
4. Pipes (built-in & custom)
5. Component Lifecycle Hooks (detailed)
6. Best Practices & Performance Tips
7. Example README-style project structure

---

## 1) Parent → Child (Input)

When the parent component needs to pass data into a child component, use `@Input()`.

### Child component (child.component.ts)

```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <div>
      <h3>Child</h3>
      <p>message: {{ message }}</p>
    </div>
  `
})
export class ChildComponent {
  @Input() message!: string; // receives from parent
}
```

### Parent template (parent.component.html)

```html
<app-child [message]="parentMessage"></app-child>
```

### Parent component (parent.component.ts)

```ts
export class ParentComponent {
  parentMessage = 'Hello from Parent';
}
```

**Notes**

- Use `@Input()` property name to map non-matching attributes: `@Input('attrName') propName`.
- Inputs are one-way (parent → child). For objects/arrays, child can mutate them unless you create immutable patterns.
- Use `ChangeDetectionStrategy.OnPush` for performance when input values are immutable.

---

## 2) Child → Parent (Output)

When the child needs to notify the parent, use `@Output()` with an `EventEmitter`.

### Child (child.component.ts)

```ts
import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <button (click)="sendUp()">Send to parent</button>
  `
})
export class ChildComponent {
  @Output() notify = new EventEmitter<string>();

  sendUp() {
    this.notify.emit('Payload from child');
  }
}
```

### Parent template

```html
<app-child (notify)="handleNotify($event)"></app-child>
```

### Parent component

```ts
export class ParentComponent {
  handleNotify(payload: string) {
    console.log('received:', payload);
  }
}
```

**Notes**

- Use typed `EventEmitter<T>` for clarity.
- Avoid using `@Output()` to pass large data constantly—prefer shared services for heavy communication or state.

---

## 3) Reusing Components (Patterns & Techniques)

Reusability is key. Here are common ways to write reusable Angular components.

### a) Inputs + Outputs

Design components that get data via `@Input()` and send events via `@Output()`.

### b) Content projection (ng-content)

Allow parent markup to be injected into child component.

```html
<!-- reusable-modal.component.html -->
<div class="modal">
  <div class="modal-header">
    <ng-content select="[modal-title]"></ng-content>
  </div>
  <div class="modal-body">
    <ng-content></ng-content>
  </div>
</div>
```

Usage:

```html
<app-reusable-modal>
  <h2 modal-title>Title goes here</h2>
  <p>Body content</p>
</app-reusable-modal>
```

### c) Structural/directive reuse

When you want behavior reuse (e.g., input auto-format), create directives instead of components.

```ts
// highlight.directive.ts
@Directive({ selector: '[appHighlight]' })
export class HighlightDirective {
  constructor(el: ElementRef) {
    el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```

### d) Smart vs Presentational components

- **Smart (container)**: handles fetching data, services, coordinates child components.
- **Presentational**: pure UI, takes `@Input()` and emits user actions with `@Output()`.

This split increases reusability and testability.

### e) Use `ng-template` + `TemplateRef` for advanced reuse

Allow parent to provide a template to customize child rendering.

```html
<!-- parent -->
<app-list [items]="users">
  <ng-template let-user>
    <b>{{ user.name }}</b>
  </ng-template>
</app-list>
```

---

## 4) Pipes (everything you need)

Pipes transform values in templates. Angular has built-in pipes like `date`, `currency`, `uppercase`, `async`, etc. You can also write custom pipes.

### Built-in example

```html
{{ birthday | date:'mediumDate' }}
{{ price | currency:'USD' }}
{{ myText | uppercase }}
```

### async pipe

Use `| async` to unwrap Observables/Promises in templates and auto-subscribe/unsubscribe.

```html
<div *ngIf="user$ | async as user">
  {{ user.name }}
</div>
```

### Creating a custom pipe

Custom pipes must be pure by default. A pure pipe runs only when input reference changes.

```ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 50) {
    if (!value) return '';
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
```

Usage:

```html
{{ longText | truncate:100 }}
```

### Impure pipes

If your pipe depends on mutable data or external state, mark it impure with `pure: false`. But impure pipes run every change detection cycle — heavy on performance. Prefer immutable data and pure pipes.

```ts
@Pipe({ name: 'random', pure: false })
```

### Best practices for pipes

- Use pipes for display-only transformations.
- Keep logic small and deterministic.
- For heavy computations, use memoization or move logic to component and use `OnPush` change detection.

---

## 5) Component Lifecycle Hooks — *Tell me everything* (detailed)

Angular provides lifecycle hooks that let you tap into key moments of a component's life. Order matters.

### Creation / initialization phase

1. `constructor()` — class instantiation. **Don't access inputs or DOM here.** Use constructor for DI only.
2. `ngOnChanges(changes: SimpleChanges)` — called when an `@Input()` value changes (including first time). Receives `SimpleChanges` with `previousValue`, `currentValue`, `firstChange`.
3. `ngOnInit()` — called once after first `ngOnChanges`. Use this for component initialization, fetching data, or setting up initial state.
4. `ngDoCheck()` — called with every change detection run. Use only for custom change detection logic; expensive.

### After content projection

5. `ngAfterContentInit()` — called once after Angular projects external content into the component (after `<ng-content>` is initialized).
6. `ngAfterContentChecked()` — called after every check of projected content.

### After view initialization

7. `ngAfterViewInit()` — called once after component's views and child views are initialized. Safe place to access `@ViewChild` elements.
8. `ngAfterViewChecked()` — called after every check of the component's views and child views.

### Destruction

9. `ngOnDestroy()` — called just before Angular destroys the component. Clean up subscriptions, timers, detach event listeners here.

### Typical use-cases & rules of thumb

- `constructor`: inject dependencies only.
- `ngOnChanges`: react to input changes; do not heavy-lift initialization here (use `ngOnInit` when first set).
- `ngOnInit`: initialize component, start fetching data, set initial values.
- `ngAfterViewInit`: safe access to `@ViewChild` and DOM-related initialization (e.g., third-party libs that need a DOM element).
- `ngOnDestroy`: unsubscribe from Observables (or use `takeUntil` / `async` pipe), clear timers, etc.

### Example showing calls order

```ts
@Component({...})
export class DemoComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  @Input() data: any;

  constructor() { console.log('constructor'); }
  ngOnChanges(changes: SimpleChanges) { console.log('ngOnChanges', changes); }
  ngOnInit() { console.log('ngOnInit'); }
  ngAfterViewInit() { console.log('ngAfterViewInit'); }
  ngOnDestroy() { console.log('ngOnDestroy'); }
}
```

**Remember**: for `@Input()` values, `ngOnChanges` runs before `ngOnInit` on the first change.

---

## 6) Best Practices & Performance Tips

- Use `OnPush` change detection whenever possible and work with immutable data.
- Prefer `async` pipe inside templates instead of manual `subscribe`/`unsubscribe` in components.
- Keep components small and single-responsibility: UI vs logic split.
- Avoid heavy work in lifecycle hooks that run often (`ngDoCheck`, `ngAfterViewChecked`).
- Clean up subscriptions in `ngOnDestroy` or use `takeUntil` pattern.
- Use `trackBy` in `*ngFor` to improve list rendering performance.
- Avoid using `ElementRef.nativeElement` unless necessary; prefer `Renderer2` for safe DOM manipulations.
- Leverage Angular CLI generators: `ng generate component`, `ng generate pipe`, `ng generate directive`.

---

## 7) Example README-style project structure (where to place things)

```
/src/app/
  shared/
    components/
      reusable-modal/
        reusable-modal.component.ts
        reusable-modal.component.html
        reusable-modal.component.css
    pipes/
      truncate.pipe.ts
    directives/
      highlight.directive.ts
  features/
    users/
      user-list.component.ts
      user-item.component.ts
  app.component.ts
  app.module.ts
```

---

## Extra: Common Patterns

### Shared service for sibling communication

When two sibling components need to talk, use a shared service with a `BehaviorSubject` or `Subject`.

```ts
@Injectable({ providedIn: 'root' })
export class SiblingService {
  private msg$ = new Subject<string>();
  send(msg: string) { this.msg$.next(msg); }
  onMessage(): Observable<string> { return this.msg$.asObservable(); }
}
```

### Debouncing user input

For input-heavy components (search), debounce the stream with RxJS in the component/service.

```ts
this.searchTerms.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.searchService.search(term))
)
```

---
