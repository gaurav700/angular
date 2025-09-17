// src/app/app.component.ts
import { Component } from "@angular/core";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = 'Angular Communication Demo';
  longText = 'This is a long piece of demo text to demonstrate the truncate pipe — change it and watch the pipe shorten the output for you.';
}
