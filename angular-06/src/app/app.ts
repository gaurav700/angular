import { NgFor } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';


interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  avatar: string;
}


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgFor],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('angular-06');

  users: User[] = [
  { id: 1, name: 'Gaurav Sharma', email: 'gaurav@example.com', role: 'Software Engineer', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Anita Verma', email: 'anita@example.com', role: 'Data Scientist', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Rahul Mehta', email: 'rahul@example.com', role: 'Product Manager', avatar: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha@example.com', role: 'UI/UX Designer', avatar: 'https://randomuser.me/api/portraits/women/25.jpg' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@example.com', role: 'DevOps Engineer', avatar: 'https://randomuser.me/api/portraits/men/48.jpg' },
  { id: 6, name: 'Neha Gupta', email: 'neha@example.com', role: 'QA Engineer', avatar: 'https://randomuser.me/api/portraits/women/37.jpg' },
  { id: 7, name: 'Arjun Nair', email: 'arjun@example.com', role: 'Business Analyst', avatar: 'https://randomuser.me/api/portraits/men/19.jpg' },
  { id: 8, name: 'Priya Reddy', email: 'priya@example.com', role: 'Machine Learning Engineer', avatar: 'https://randomuser.me/api/portraits/women/60.jpg' },
  { id: 9, name: 'Karan Malhotra', email: 'karan@example.com', role: 'Cloud Architect', avatar: 'https://randomuser.me/api/portraits/men/77.jpg' },
  { id: 10, name: 'Meera Iyer', email: 'meera@example.com', role: 'Full Stack Developer', avatar: 'https://randomuser.me/api/portraits/women/50.jpg' }
];
}
