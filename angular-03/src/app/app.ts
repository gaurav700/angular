import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-03');


  isDisplay:Boolean = false;
  toggle(){
    this.isDisplay = !this.isDisplay;
  }


  color:number = 1;

  setColor(val:number){
    this.color = val;
  }

  handleInput(event:Event){
    this.color = Number((event.target as HTMLInputElement).value);
  }


  users = ["Gaurav", "Akshita", "Kunal", "Runjeeth"]
}
