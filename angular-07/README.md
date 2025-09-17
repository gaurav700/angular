# Angular Routing & Passing Data 

A concise guide to Angular routing and common techniques to pass data between routes:

- Pass data with `routerLink`: path params, matrix params, query params  
- Pass data programmatically (button click → `Router.navigate`)  
- Pass complex data with `state` (one-time transfer)  
- Use a shared service for persistent or large objects  
- How to read params in the destination component (snapshot vs observable)

---

## Table of contents
1. Overview  
2. Quick route setup (example)  
3. Passing data with `routerLink`
   - Path params
   - Matrix params
   - Query params
4. Passing data with button click (programmatic)
   - `Router.navigate` + `NavigationExtras`
5. Passing data with `state`
6. Shared service approach (recommended for complex objects)
7. Reading params inside the destination component
   - `snapshot` vs `subscribe`
8. Minimal working example (files + snippets)
9. Best practices & gotchas
10. Quick checklist

---

## 1 — Overview
Angular supports several ways to pass data between routes. Use path params for resource IDs and query params for filtering/searching. For complex objects, prefer a shared service or send an ID and fetch the data on the destination. `history.state` (navigation `state`) is convenient for one-off transfers but fragile across full reloads.

---

## 2 — Quick route setup (example)
`app-routing.module.ts`
```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './profile.component';
import { SearchComponent } from './search.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'profile/:id', component: ProfileComponent }, // path param
  { path: 'profile', component: ProfileComponent },     // optional matrix usage
  { path: 'search', component: SearchComponent },       // query params example
  { path: '**', redirectTo: '' }                        // fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
```

---

## 3 — Passing data with `routerLink`

### A) Path params (URL segment)
Use when the data is an identifier (id, slug).
```html
<!-- creates /profile/123 -->
<a [routerLink]="['/profile', user.id]">Open profile</a>
```
Read in `ProfileComponent`:
```ts
this.userId = this.route.snapshot.paramMap.get('id');
// or reactive:
this.route.paramMap.subscribe(p => this.userId = p.get('id'));
```

### B) Matrix params (`/route;key=value`)
Less common. Attaches params to a particular route segment.
```html
<!-- creates /profile;name=Gaurav -->
<a [routerLink]="['/profile', { name: 'Gaurav' }]">Profile (matrix)</a>
```
Read it with:
```ts
this.route.snapshot.paramMap.get('name');
```

### C) Query params (`?key=value`)
Great for filters, searches, and pagination — bookmarkable and shareable.
```html
<!-- creates /search?q=angular&page=2 -->
<a [routerLink]="['/search']" [queryParams]="{ q: 'angular', page: 2 }">Search</a>
```
Read it in the destination:
```ts
const q = this.route.snapshot.queryParamMap.get('q');
// or:
this.route.queryParamMap.subscribe(m => console.log(m.get('q')));
```

---

## 4 — Passing data with a button click (programmatic)
Use `Router.navigate` when you need logic before navigation (e.g., validation).

`home.component.html`
```html
<button (click)="goToProfile(user)">Open profile</button>
```

`home.component.ts`
```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({ selector: 'app-home', templateUrl: './home.component.html' })
export class HomeComponent {
  constructor(private router: Router) {}

  goToProfile(user: { id: string, name: string }) {
    // Path param:
    this.router.navigate(['/profile', user.id]);

    // Query params:
    // this.router.navigate(['/search'], { queryParams: { q: user.name } });

    // Matrix param:
    // this.router.navigate(['/profile', { name: user.name }]);

    // State:
    // this.router.navigate(['/profile'], { state: { user } });
  }
}
```

---

## 5 — Passing data using `state` (history.state)
`state` passes complex objects without putting them in the URL. It's good for one-off transfers (e.g., from a search list directly to edit form).

Navigate:
```ts
this.router.navigate(['/profile'], { state: { user: { id:'123', name: 'Gaurav' } } });
```
Read on the destination:
```ts
import { Router } from '@angular/router';

// in constructor or ngOnInit
const nav = this.router.getCurrentNavigation();
if (nav?.extras?.state) {
  this.user = nav.extras.state['user']; // available only during navigation lifecycle
}

// fallback (after reload) — less reliable:
this.user = history.state?.user;
```
Notes:
- `nav.extras.state` is only present while the navigation happens. On refresh, you may only have `history.state`.
- Don’t rely on `state` for data that must persist across reloads. Use a service or server fetch instead.

---

## 6 — Shared service approach (recommended for complex objects)
A service acts as an in-memory transfer zone (or cache) and is the most robust for large or complex objects.

`transfer.service.ts`
```ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransferService {
  private data = new BehaviorSubject<any>(null);
  data$ = this.data.asObservable();

  set(value: any) { this.data.next(value); }
  get() { return this.data.getValue(); }
  clear() { this.data.next(null); }
}
```

Usage:
```ts
// Before navigation
this.transferService.set(user);
this.router.navigate(['/profile', user.id]);

// In destination
this.transferService.data$.subscribe(u => this.user = u);
// or const u = this.transferService.get();
```

---

## 7 — Reading params: `snapshot` vs `subscribe`
- `snapshot.paramMap.get('id')` — synchronous. Works if the component is recreated on navigation.
- `route.paramMap.subscribe(...)` — use this when the same component instance handles route changes (child routes or reused components).
Same applies to `queryParamMap`.

Example:
```ts
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    this.userId = params.get('id');
    // fetch user based on id
  });

  this.route.queryParamMap.subscribe(q => {
    this.searchTerm = q.get('q');
  });
}
```

---

## 8 — Minimal working example (all together)

`home.component.html`
```html
<a [routerLink]="['/profile', '123']">Profile 123 (path)</a>
<a [routerLink]="['/profile', { name: 'Gaurav' }]">Profile (matrix)</a>
<a [routerLink]="['/search']" [queryParams]="{ q: 'angular' }">Search for Angular</a>

<button (click)="openProfile()">Open Profile (programmatic + state)</button>
```

`home.component.ts`
```ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TransferService } from './transfer.service';

@Component({ selector: 'app-home', templateUrl: './home.component.html' })
export class HomeComponent {
  constructor(private router: Router, private t: TransferService) {}

  openProfile() {
    const user = { id: '123', name: 'Gaurav', prefs: { theme: 'dark' } };
    this.t.set(user); // store it in service
    this.router.navigate(['/profile', user.id], { state: { from: 'home' }});
  }
}
```

`profile.component.ts`
```ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferService } from './transfer.service';

@Component({
  selector: 'app-profile',
  template: `<h1>{{user?.name || 'Guest'}}</h1><p>Id: {{userId}}</p>`
})
export class ProfileComponent implements OnInit {
  user: any = null;
  userId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private t: TransferService
  ) {}

  ngOnInit() {
    // 1) path param
    this.userId = this.route.snapshot.paramMap.get('id');

    // 2) try service
    this.user = this.t.get();

    // 3) try navigation state
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state) {
      this.user = nav.extras.state['user'] ?? this.user;
    }

    // 4) fallback: history.state
    if (!this.user) {
      this.user = history.state?.user ?? null;
    }

    // 5) If still null, load from server using userId
    if (!this.user && this.userId) {
      this.loadUserFromServer(this.userId);
    }
  }

  private loadUserFromServer(id: string) {
    // TODO: HTTP call to fetch the user
  }
}
```

---

## 9 — Best practices & gotchas
- Use **path params** for resource identity (`/users/123`) — clean URLs, good for bookmarking.
- Use **query params** for filters and pagination — shareable and bookmarkable.
- Avoid putting large or sensitive objects in the URL.
- `routerLink` object syntax (e.g., `['/profile', { name: 'X' }]`) creates matrix params — not widely used.
- `history.state` is convenient but fragile across full reloads. Don’t rely on it for persistent data.
- If the same component handles multiple parameter values without recreation, use `paramMap.subscribe()` to react to changes.
- If you see a 404, check:
  - Route path defined correctly in `AppRoutingModule`.
  - Component declared or standalone: `standalone: true` + `imports` OR declared in an `NgModule`.
  - RouterLink matches the route (matrix vs path param mismatch is a common cause).
- When debugging, log `this.route.snapshot`, `this.route.snapshot.paramMap`, `this.router.getCurrentNavigation()`.

---

## 10 — Quick checklist
- [ ] Route exists for path param if you use `['/profile', id]`.  
- [ ] Use `[queryParams]` for filters.  
- [ ] Use `router.navigate([...], { state: {...} })` for one-time object transfer.  
- [ ] Use `TransferService` for persistent/large objects or complex multi-step flows.  
- [ ] Use `paramMap.subscribe()` if the component may not be recreated for new params.  
- [ ] Avoid sensitive or large data in URLs.
