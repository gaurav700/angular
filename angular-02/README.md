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