import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

   onSubmit() {
    // Placeholder for authentication logic
    console.log('Login submitted', { email: this.email, password: this.password });
    
    // Simulate successful login and navigate to dashboard
    this.router.navigate(['/administrator/dashboard']);
  }
}
