## Using `*ngIf` and `else` in Angular

In Angular templates, you can use the `*ngIf` directive to conditionally display elements. To provide an alternative template when the condition is false, use the `else` keyword.

```html
<div *ngIf="isLoggedIn; else loginPrompt">
    Welcome back, user!
</div>
<ng-template #loginPrompt>
    Please log in to continue.
</ng-template>
```

- `isLoggedIn` is a boolean property in your component.
- If `isLoggedIn` is `true`, the welcome message is shown.
- If `isLoggedIn` is `false`, the content inside the `ng-template` with the reference `loginPrompt` is displayed.

**Learn more:** [Angular Structural Directives](https://angular.io/guide/structural-directives)