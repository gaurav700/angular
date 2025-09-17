import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-about',
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
protected readonly title = signal('about');

constructor(private router:Router){}

goToProfile(){
  this.router.navigate(['profile'], {queryParams : {name:"Gaurav Jangid"}})
}
}
