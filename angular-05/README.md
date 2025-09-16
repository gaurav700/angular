# Angular `@for` Loop 

## Basic Syntax

```html
@for(item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```

- `item of items` → loops through the array  
- `track item.id` → improves performance by tracking unique IDs

---

## Contextual Variables

Inside the `@for` loop, Angular automatically provides **contextual variables**.  
You don’t declare them — they are already available:

| Variable   | Description |
|------------|-------------|
| **`$count`** | Total number of items in the loop |
| **`$index`** | Current index (0-based) |
| **`$first`** | `true` if this is the first item |
| **`$last`**  | `true` if this is the last item |
| **`$odd`**   | `true` if the row index is odd |
| **`$even`**  | `true` if the row index is even |

---

## Example with Context Variables

```html
<div class="list">
  @for(user of users; track user.id) {
    <div class="user"
         [class.first]="$first"
         [class.last]="$last"
         [class.odd]="$odd"
         [class.even]="$even">

      <h3>{{ $index + 1 }} / {{ $count }} — {{ user.name }}</h3>
      <p>Email: {{ user.email }}</p>
    </div>
  }
</div>
```

---

## Empty Block

You can also define what should render if the array is **empty** using the `@empty` block.

```html
<div class="list">
  @for(user of users; track user.id) {
    <div>{{ user.name }}</div>
  } @empty {
    <p>No users found.</p>
  }
</div>
```

---

## Comparison with `*ngFor`

Old syntax (`*ngFor`):

```html
<div *ngFor="let user of users; let i = index; let count = count">
  {{ i + 1 }}/{{ count }} - {{ user.name }}
</div>
```

New syntax (`@for`):

```html
@for(user of users; track user.id) {
  {{ $index + 1 }}/{{ $count }} - {{ user.name }}
}
```


---

# Angular Two-Way Binding 

Angular provides **two-way data binding** to keep component properties and template inputs in sync.  
This is typically done using the **`[(ngModel)]`** directive.

---

## Basic Syntax

```html
<input [(ngModel)]="username" placeholder="Enter your name">
<p>Hello, {{ username }}!</p>
```

- `[(ngModel)]="username"` → binds the input to the `username` property in the component.  
- When the user types, the component property updates.  
- When the component property changes, the input updates.  
- This is called **two-way binding**.

---

## How It Works

Two-way binding is essentially **property binding + event binding** combined:

```html
<input [ngModel]="username" (ngModelChange)="username = $event">
```

- `[ngModel]` → one-way binding from component to view.  
- `(ngModelChange)` → one-way binding from view to component.  
- Together, they form `[(ngModel)]`.

---

## Component Example

```ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  username: string = '';
}
```

```html
<!-- app.component.html -->
<h2>Two-Way Binding Example</h2>
<input [(ngModel)]="username" placeholder="Type your name">
<p>Your name is: <strong>{{ username }}</strong></p>
```

---

## Requirements

- Import **FormsModule** in your app module:

```ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## Example with Multiple Fields

```html
<h2>Profile Form</h2>
<label>
  Name:
  <input [(ngModel)]="name">
</label>

<label>
  Email:
  <input [(ngModel)]="email">
</label>

<p>Preview:</p>
<ul>
  <li><strong>Name:</strong> {{ name }}</li>
  <li><strong>Email:</strong> {{ email }}</li>
</ul>
```

```ts
export class AppComponent {
  name: string = '';
  email: string = '';
}
```

---