Angular v17 introduced a new template control flow syntax using `@if`, `@else`, and `@switch`, making conditional rendering more concise and readable.

### `@if` and `@else`

You can use `@if` to conditionally render content, and `@else` for the alternative case:

```html
@if (isLoggedIn) {
    Welcome back, user!
} @else {
    Please log in to continue.
}
```

- `isLoggedIn` is a boolean property in your component.
- If `isLoggedIn` is `true`, the welcome message is shown.
- If `isLoggedIn` is `false`, the alternative message is displayed.

### `@if` with `else if`

You can chain conditions using `@else if`:

```html
@if (status === 'admin') {
    Welcome, Admin!
} @else if (status === 'user') {
    Welcome, User!
} @else {
    Welcome, Guest!
}
```

### `@switch` for Multiple Conditions

For multiple possible values, use `@switch`:

```html
@switch (status) {
    @case ('admin') {
        Welcome, Admin!
    }
    @case ('admin') {
        Welcome, User!
    }
    @default {
        Welcome, Guest!
    }
}
```

- Use `@switch` for cleaner code when checking several values.
- Use `@if`/`@else` for simple conditional branches.

**Learn more:** [Angular Control Flow Blocks](https://angular.dev/reference/templates/control-flow)