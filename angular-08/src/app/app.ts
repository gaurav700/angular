import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveForm } from './reactive-form/reactive-form';
import { TemplateForm } from './template-form/template-form';

@Component({
  selector: 'app-root',
  imports: [CommonModule, TemplateForm, ReactiveForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  active: 'template' | 'reactive' = 'template';
}
