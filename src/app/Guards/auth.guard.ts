import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    // Placeholder for authentication check
    const isAuthenticated = false; // Replace with actual auth check (e.g., token from localStorage)
    
//  अगर isAuthenticated === false है, तो उपयोगकर्ता को लॉगिन पेज पर रीडायरेक्ट करें
    if (!isAuthenticated) {
      this.router.navigate(['/administrator']);
      return false;
    }
    return true;
  }
}