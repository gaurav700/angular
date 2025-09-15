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
  state:String = "Show";
  toggle(){
    this.isDisplay = !this.isDisplay;
    if(this.state== "Show") this.state= "Hide";
    else if(this.state == "Hide")this.state="Show";
  }



}
