## Data Types in Angular

Defining data types in Angular (using TypeScript) helps catch errors early, improves code readability, and enables better tooling support.

### Why Define Types?

- **Error Prevention:** Type checking helps catch mistakes during development.
- **Readability:** Makes code easier to understand.
- **Tooling:** Enables features like autocompletion and refactoring.

### Defining a Type for a Property

```typescript
export class ExampleComponent {
    name: string = 'Angular';
}
```

### Defining Multiple Types for a Property

You can use union types to allow multiple types:

```typescript
export class ExampleComponent {
    value: string | number = 'Hello';
}
```

### Defining Types for Function Parameters

```typescript
greet(name: string, age: number): void {
    console.log(`Hello ${name}, age ${age}`);
}
```

### Calling Functions with Parameters on Button Click

In your template:

```html
<button (click)="greet('Alice', 30)">Greet</button>
```

In your component:

```typescript
greet(name: string, age: number): void {
    alert(`Hello ${name}, age ${age}`);
}
```



---
## Handling Events in Angular

Angular provides robust support for handling various DOM events, such as mouse events and input field events. You can bind to these events in your templates and define corresponding handler functions in your components.

### Common Event Types

- **Mouse Events:** `click`, `dblclick`, `mousedown`, `mouseup`, `mouseenter`, `mouseleave`, etc.
- **Keyboard Events:** `keydown`, `keyup`, `keypress`
- **Input Field Events:** `input`, `change`, `focus`, `blur`

### Checking Event Types

You can access the event object in your handler to check its type and properties:

```typescript
onEvent(event: Event): void {
    console.log('Event type:', event.type);
}
```

### Calling Functions on Input Field Events

Bind to events directly in your template:

```html
<input (input)="onInput($event)" (focus)="onFocus($event)" (blur)="onBlur($event)">
```

In your component:

```typescript
onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    console.log('Input value:', input.value);
}

onFocus(event: FocusEvent): void {
    console.log('Input focused');
}

onBlur(event: FocusEvent): void {
    console.log('Input lost focus');
}
```

### Example: Handling Mouse Events

```html
<button (click)="onClick($event)">Click Me</button>
```

```typescript
onClick(event: MouseEvent): void {
    console.log('Button clicked at:', event.clientX, event.clientY);
}
```
