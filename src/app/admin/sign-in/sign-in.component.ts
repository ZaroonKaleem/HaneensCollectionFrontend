// src/app/sign-in/sign-in.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthLoading, selectAuthError } from '../../Store/Auth/auth.selectors';
import * as AuthActions from '../../Store/Auth/auth.actions';
import { AppState } from '../../Store/app.state';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  email: string = '';
  password: string = '';
  loading$!: Observable<boolean>; // Use definite assignment assertion
  error$!: Observable<string | null>; // Use definite assignment assertion

  constructor(
    private router: Router,
    private store: Store<AppState>
  ) {
    // Initialize observables in the constructor
    this.loading$ = this.store.select(selectAuthLoading);
    this.error$ = this.store.select(selectAuthError);
  }

  onSubmit() {
    if (this.email && this.password) {
      this.store.dispatch(
        AuthActions.login({
          username: this.email,
          password: this.password
        })
      );
    }
  }
}