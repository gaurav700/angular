import { Component, computed, signal, WritableSignal } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  readonly title = signal('angular-04');
  counter = signal(0);
  x = signal<number | string>(0);
  y: WritableSignal<number | string> = signal('Hello');

  
  first: WritableSignal<number> = signal(0);
  second: WritableSignal<number> = signal(0);
  third: WritableSignal<number> = signal(0);

  sum = computed(() => this.first() + this.second() + this.third());

  handleInput(event: Event, idx: number) {
    const input = event.target as HTMLInputElement;
    const val = Number(input.value); 
    const safeVal = Number.isFinite(val) ? val : 0;

    if (idx === 1) {
      this.first.set(safeVal);
    } else if (idx === 2) {
      this.second.set(safeVal);
    } else {
      this.third.set(safeVal);
    }
  }
}
