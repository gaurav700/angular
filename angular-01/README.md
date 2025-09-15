# Angular Interpolation

## What is Interpolation?

Interpolation in Angular is a technique for embedding expressions within double curly braces `{{ }}` in your HTML templates. It allows you to display dynamic data from your component class directly in the view.

## Examples of Interpolation

Suppose your component class has a property:

```typescript
export class AppComponent {
  title = 'Angular Interpolation Example';
  user = { name: 'Alice', age: 25 };
}
```

You can use interpolation in your template as follows:

```html
<h1>{{ title }}</h1>
<p>Hello, {{ user.name }}!</p>
<p>Your age is {{ user.age }}</p>
<p>Next year, you will be {{ user.age + 1 }}</p>
```

This will render:

```
Angular Interpolation Example
Hello, Alice!
Your age is 25
Next year, you will be 26
```

## Limitations of Interpolation

- **Only One-Way Binding:** Interpolation only updates the view when the data changes, not vice versa.
- **Expressions Only:** You can use simple expressions (property access, arithmetic, method calls), but not statements (like assignments or control flow).
- **No Side Effects:** Interpolation cannot be used to execute code that changes application state.
- **HTML Context:** Interpolation works only within HTML element content and attribute values, not in property bindings or event bindings.

**Invalid examples:**

```html
<!-- Not allowed: assignments or statements -->
{{ user.age = 30 }} <!-- Invalid -->

<!-- Not allowed: control flow -->
{{ if (user.age > 18) 'Adult' else 'Minor' }} <!-- Invalid -->
```

## Summary

Angular interpolation is a simple and powerful way to display dynamic data in your templates, but it is limited to one-way binding and simple expressions.

---

# Components in Angular

## What is a Component?

A component is a fundamental building block of Angular applications. It controls a part of the user interface (UI) and contains the logic and data for that section.

## What is a Component in Angular?

In Angular, a component is a TypeScript class decorated with `@Component`. It defines:
- The template (HTML) for the UI
- The logic (TypeScript class)
- The styles (CSS)
- Metadata (selector, template, etc.)

## How to Make and Use a Component

1. **Create a Component:**
   Use Angular CLI:
   ```sh
   ng generate component my-component
   ```
   Or manually create the files.

2. **Component Files:**
   - `my-component.component.ts` — TypeScript class and metadata
   - `my-component.component.html` — Template
   - `my-component.component.css` — Styles
   - `my-component.component.spec.ts` — Unit tests

3. **Use a Component:**
   - Add the component's selector (e.g., `<app-my-component>`) to a template in another component.

## Example

```typescript
// my-component.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.component.html',
  styleUrls: ['./my-component.component.css']
})
export class MyComponent {
  message = 'Hello from MyComponent!';
}
```

```html
<!-- my-component.component.html -->
<p>{{ message }}</p>
```

To use this component, add `<app-my-component></app-my-component>` in another component's template.

---

# Function Call on Button Click in Angular

## Define a Function

In your component class, define a function:

```typescript
export class AppComponent {
  showMessage() {
    alert('Button clicked!');
  }
}
```

## Call a Function from a Button

In your template, use Angular's event binding to call the function when the button is clicked:

```html
<button (click)="showMessage()">Click Me</button>
```

## Call a Function from Another Function

You can call one function from another inside your component class:

```typescript
export class AppComponent {
  showMessage() {
    alert('Button clicked!');
  }

  handleClick() {
    this.showMessage(); // Call another function
  }
}
```

And in your template:

```html
<button (click)="handleClick()">Click Me</button>
```

---



