// src/app/store/auth/auth.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export const login$ = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        http.post<{ token: string }>(
          `${environment.apiUrl}/Auth/login`,  // Using environment variable
          { 
            username: action.username, 
            password: action.password 
          }
        ).pipe(
          map(response => AuthActions.loginSuccess({ token: response.token })),
          catchError(error => {
            // You can also handle different error messages here
            const errorMessage = error.error?.message || error.message || 'Unknown error';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    );
  },
  { functional: true }
);

// In your auth.effects.ts
export const loginSuccess$ = createEffect(
  (actions$ = inject(Actions), router = inject(Router)) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => router.navigate(['/administrator/dashboard']))
    );
  },
  { functional: true, dispatch: false }
);

export const AuthEffects = { login$ };