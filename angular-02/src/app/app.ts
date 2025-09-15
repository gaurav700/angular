import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-02');

  name:String = "Gaurav";
  age:number = 26;
  phoneNO:String|number = "848-363-3434";
  email:any = "garuav@asdkgf.adf";

  x:number = 0;

  handleCount(operation:String){
    if(operation=="Inc"){
      this.x++;
    }else if(operation=="Dec"){
      if(this.x <= 0){
        alert("You cannot go below 0");
      }else{
      this.x--;
      }
    }else if(operation=="reset"){
      this.x = 0;
    }
  }
}
