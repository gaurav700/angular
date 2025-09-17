# Angular Forms — Template-driven & Reactive

## Table of contents

- [Angular Forms — Template-driven \& Reactive](#angular-forms--template-driven--reactive)
  - [Table of contents](#table-of-contents)
  - [When to use Template vs Reactive](#when-to-use-template-vs-reactive)
  - [Template-driven forms](#template-driven-forms)
    - [Imports](#imports)
    - [Creating a form (HTML + TS)](#creating-a-form-html--ts)
    - [Getting values](#getting-values)
    - [Setting / updating values \& defaults](#setting--updating-values--defaults)
    - [Validation (template-driven)](#validation-template-driven)
    - [Tips \& caveats (template-driven)](#tips--caveats-template-driven)
  - [Reactive forms](#reactive-forms)
    - [Imports](#imports-1)
    - [Creating a form](#creating-a-form)
    - [Getting values](#getting-values-1)
    - [Setting / updating values \& defaults](#setting--updating-values--defaults-1)
    - [FormGroup, FormArray, nested groups](#formgroup-formarray-nested-groups)
    - [Validation (reactive)](#validation-reactive)
    - [Useful APIs](#useful-apis)
  - [Form validation patterns for both approaches](#form-validation-patterns-for-both-approaches)
    - [Showing errors in the UI (reactive)](#showing-errors-in-the-ui-reactive)
    - [Custom synchronous validator](#custom-synchronous-validator)
    - [Custom async validator](#custom-async-validator)
    - [Cross-field validation](#cross-field-validation)
    - [Display cross-field error in template](#display-cross-field-error-in-template)
  - [Common patterns \& best practices](#common-patterns--best-practices)

---

## When to use Template vs Reactive

- **Template-driven forms**

  - Simpler APIs and less boilerplate.
  - Great for simple forms and quick prototypes.
  - Logic lives mostly in templates.
  - Two-way binding via `ngModel`.
  - Use when form complexity and dynamic behavior are low.

- **Reactive forms**

  - Explicit, immutable, model-driven approach.
  - Better for complex, dynamic forms (conditional controls, arrays, dynamic addition/removal of fields).
  - Easier to unit test (pure TS, no template dependency).
  - Use when you need fine-grained control, complex validation, or performance.

---

## Template-driven forms

### Imports

```ts
// app.module.ts (or relevant module)
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    FormsModule
  ]
})
export class AppModule {}
```

If you're using a standalone component, add `imports: [FormsModule]` to the `@Component` metadata.

### Creating a form (HTML + TS)

**Template (template-driven):**

```html
<!-- user-form.component.html -->
<form #f="ngForm" (ngSubmit)="onSubmit(f)">
  <label>
    Name
    <input name="name" ngModel required minlength="3" #nameCtrl="ngModel" />
  </label>

  <label>
    Email
    <input name="email" ngModel type="email" #emailCtrl="ngModel" />
  </label>

  <button type="submit" [disabled]="f.invalid">Submit</button>
</form>
```

**Component TS:**

```ts
export class UserFormComponent {
  onSubmit(form: NgForm) {
    console.log('form value', form.value);
  }
}
```

### Getting values

- Use `NgForm` (template reference `#f="ngForm"`) then `f.value` for the form object.
- For single control, template variables like `#nameCtrl="ngModel"` let you inspect validity and value: `nameCtrl.value`.

### Setting / updating values & defaults

- Set default values using component properties bound with `ngModel`.

```ts
export class UserFormComponent {
  model = { name: 'Alice', email: 'alice@example.com' };
}
```

```html
<input name="name" ngModel [(ngModel)]="model.name" />
<input name="email" ngModel [(ngModel)]="model.email" />
```

- You can programmatically change `model` and the form updates automatically.

### Validation (template-driven)

- Use built-in attributes: `required`, `minlength`, `maxlength`, `pattern`, `type="email"`.
- Access control status via template variable: `#emailCtrl="ngModel"` then `emailCtrl.valid`, `emailCtrl.touched`.

```html
<div *ngIf="emailCtrl.invalid && (emailCtrl.dirty || emailCtrl.touched)">
  <small *ngIf="emailCtrl.errors?.required">Email is required</small>
  <small *ngIf="emailCtrl.errors?.email">Invalid email</small>
</div>
```

### Tips & caveats (template-driven)

- Simpler but logic scattered into templates — harder to unit test.
- For dynamic forms (adding controls at runtime) prefer reactive forms.
- `ngModel` inside reactive forms (using `formControlName`) is generally discouraged.

---

## Reactive forms

### Imports

```ts
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [ReactiveFormsModule]
})
export class AppModule {}
```

For standalone components, put `imports: [ReactiveFormsModule]`.

### Creating a form

**Using **``** (recommended):**

```ts
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }
  }
}
```

**Template:**

```html
<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
  <input formControlName="email" />
  <input formControlName="password" type="password" />
  <input formControlName="remember" type="checkbox" />
  <button [disabled]="loginForm.invalid">Login</button>
</form>
```

### Getting values

- `this.loginForm.value` returns the object with values.
- `this.loginForm.get('email')?.value` returns a single control value.
- `this.loginForm.get('some.deep.path')` works for nested groups.

### Setting / updating values & defaults

- Defaults are set when creating the control: `['default', Validators...]`.
- Update controls:
  - `setValue({ ... })` — requires the full structure.
  - `patchValue({ some: 'value' })` — partial updates allowed.
  - `control.setValue('x')` for FormControl.
  - `control.patchValue({})` for partial updates.

```ts
this.loginForm.patchValue({ email: 'bob@example.com' });
this.loginForm.get('remember')?.setValue(true);
```

### FormGroup, FormArray, nested groups

**Nested group example:**

```ts
this.profileForm = this.fb.group({
  name: this.fb.group({
    first: ['', Validators.required],
    last: ['']
  }),
  address: this.fb.group({
    street: [''],
    city: ['']
  })
});

// get nested control
this.profileForm.get('name.first')?.value;
```

**FormArray example:**

```ts
this.fb.group({
  phones: this.fb.array([
    this.fb.control('', Validators.required)
  ])
});

// add phone
(this.form.get('phones') as FormArray).push(this.fb.control(''));
```

### Validation (reactive)

- Use `Validators` from `@angular/forms`.
- Add validators when declaring controls.
- You can also add/update validators at runtime:

```ts
const email = this.loginForm.get('email');
email?.setValidators([Validators.required, Validators.email, customValidator]);
email?.updateValueAndValidity();
```

### Useful APIs

- `valueChanges` — observable for value changes.
- `statusChanges` — observable for status (`VALID`, `INVALID`, `PENDING`).
- `.disable()` / `.enable()` — enable/disable controls.
- `.reset()` — reset values and state.

```ts
this.loginForm.valueChanges.subscribe(value => console.log(value));
```

---

## Form validation patterns for both approaches

### Showing errors in the UI (reactive)

```html
<input formControlName="email" />
<div *ngIf="email.invalid && (email.dirty || email.touched)">
  <small *ngIf="email.errors?.required">Email required</small>
  <small *ngIf="email.errors?.email">Invalid email</small>
</div>
```

In the component getter:

```ts
get email() { return this.loginForm.get('email')!; }
```

### Custom synchronous validator

```ts
import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cannotContainSpace(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  return value && value.indexOf(' ') >= 0 ? { cannotContainSpace: true } : null;
}

// use:
this.fb.control('', [cannotContainSpace]);
```

### Custom async validator

```ts
import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';

export function checkUniqueUsername(apiService: ApiService) {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);
    return apiService.usernameExists(control.value).pipe(
      map(exists => (exists ? { usernameTaken: true } : null))
    );
  };
}

// use when creating control:
this.fb.control('', null, checkUniqueUsername(this.api));
```

Note: Async validators return `Observable<ValidationErrors|null>` and the control status will be `PENDING` while waiting.

### Cross-field validation

Use a validator on the `FormGroup` for rules that span multiple controls (e.g., password match):

```ts
function passwordsMatch(group: AbstractControl) {
  const p1 = group.get('password')?.value;
  const p2 = group.get('confirmPassword')?.value;
  return p1 === p2 ? null : { passwordsMismatch: true };
}

this.form = this.fb.group({
  password: ['', Validators.required],
  confirmPassword: ['', Validators.required]
}, { validators: passwordsMatch });
```

### Display cross-field error in template

```html
<form [formGroup]="form">
  <!-- fields -->
  <div *ngIf="form.errors?.passwordsMismatch">Passwords do not match</div>
</form>
```

---

## Common patterns & best practices

- Prefer **Reactive** forms for complex scenarios, dynamic fields, or when you want testable form logic.
- Use `patchValue` for partial updates; `setValue` for full updates.
- Keep validation error messages in a small helper to avoid repeating logic in templates.

```ts
const errorMessages = {
  required: 'This field is required',
  minlength: (err: any) => `Minimum ${err.requiredLength} characters`
};
```

- Unsubscribe from `valueChanges` subscriptions when the component is destroyed (or use `takeUntil` pattern).
- Minimize heavy work in `valueChanges` handlers (debounce when calling APIs).
- Use `updateOn: 'blur'` if you want validation to run on blur instead of on every value change:

```ts
this.fb.control('', { validators: [Validators.email], updateOn: 'blur' })
```

- Use `FormArray` for lists of repeatable controls (addresses, phones, tags).

---

