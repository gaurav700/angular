import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';


// custom sync validator
function cannotContainSpace(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string;
  return value && value.indexOf(' ') >= 0 ? { cannotContainSpace: true } : null;
}

// mock async validator that "checks" username availability
function mockUniqueUsername(control: AbstractControl): Observable<ValidationErrors | null> {
  if (!control.value) return of(null);
  const forbidden = ['admin', 'root', 'superuser'];
  const exists = forbidden.includes(control.value.toLowerCase());
  return of(exists ? { usernameTaken: true } : null).pipe(delay(700));
}


@Component({
  selector: 'app-reactive-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reactive-form.html',
  styleUrl: './reactive-form.css'
})
export class ReactiveForm {
form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      account: this.fb.group({
        username: ['', [Validators.required, Validators.minLength(3), cannotContainSpace], [mockUniqueUsername]],
        email: ['', [Validators.required, Validators.email]]
      }),
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, { validators: passwordsMatch }),
      phones: this.fb.array([this.fb.control('', Validators.required)])
    });
  }

  get username() { return this.form.get('account.username')!; }
  get email() { return this.form.get('account.email')!; }
  get password() { return this.form.get('passwordGroup.password')!; }
  get confirmPassword() { return this.form.get('passwordGroup.confirmPassword')!; }
  get phones() { return this.form.get('phones') as FormArray; }

  addPhone() { this.phones.push(this.fb.control('', Validators.required)); }
  removePhone(i: number) { this.phones.removeAt(i); }

  onSubmit() {
    this.submitted = true;
    if (this.form.valid) {
      console.log('Reactive form value', this.form.value);
    } else {
      this.markAllTouched(this.form);
    }
  }

  reset() { this.form.reset(); this.submitted = false; }

  private markAllTouched(control: AbstractControl) {
    if ((control as any).controls) {
      const controls = (control as any).controls;
      for (const name in controls) {
        if (controls[name]) this.markAllTouched(controls[name]);
      }
    }
    control.markAsTouched({ onlySelf: true });
  }
}

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
  const p1 = group.get('password')?.value;
  const p2 = group.get('confirmPassword')?.value;
  return p1 === p2 ? null : { passwordsMismatch: true };
}