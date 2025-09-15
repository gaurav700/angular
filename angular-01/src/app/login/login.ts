import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  clickSubmit(username: string, password: string){
    alert(`User name is ${username} and password is ${password}`);
  }

  closeLogin(){
    alert("Logout Clicked");
  }
}
