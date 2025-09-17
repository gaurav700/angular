import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{
  userName: string | null = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.userName = this.route.snapshot.paramMap.get('name');
    console.log('route param name:', this.userName);


    this.route.queryParams.subscribe(params=>{
      this.userName = params['name'];
    })
    console.log('query param name:', this.userName);

    this.route.data.subscribe(data=>{
      this.userName = data['name'];
      console.log('data is ', this.userName);
    })
  }


}
