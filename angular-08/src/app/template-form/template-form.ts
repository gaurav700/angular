import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';


interface UserModel {
  name: string;
  email: string;
  age?: number;
  newsletter: boolean;
}

@Component({
  selector: 'app-template-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './template-form.html',
  styleUrl: './template-form.css'
})
export class TemplateForm {

  model: UserModel = {
    name: 'Alice Doe',
    email: 'alice@example.com',
    age: 28,
    newsletter: true
  };

  submitted = false;
  lastValue: any = null;

  onSubmit(form: NgForm) {
    this.submitted = true;
    this.lastValue = form.value;
    console.log('Template form submitted', form.value);
  }

  reset(form: NgForm) {
    form.resetForm({ name: '', email: '', age: null, newsletter: false });
    this.submitted = false;
  }
}
