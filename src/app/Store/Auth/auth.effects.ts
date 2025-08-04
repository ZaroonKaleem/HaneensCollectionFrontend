// src/app/store/auth/auth.effects.ts
import { inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import * as AuthActions from './auth.actions';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { ToastService } from '../../Services/toast.service';

export const login$ = createEffect(
  (actions$ = inject(Actions), http = inject(HttpClient)) => {
    return actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(action =>
        http.post<{ token: string }>(
          `${environment.apiUrl}/Auth/login`,
          { 
            username: action.username, 
            password: action.password 
          }
        ).pipe(
          map(response => AuthActions.loginSuccess({ token: response.token })),
          catchError(error => {
            const errorMessage = error.error?.message || error.message || 'Unknown error';
            return of(AuthActions.loginFailure({ error: errorMessage }));
          })
        )
      )
    );
  },
  { functional: true }
);

export const loginSuccess$ = createEffect(
  (actions$ = inject(Actions), 
   router = inject(Router),
   toastService = inject(ToastService)) => {
    return actions$.pipe(
      ofType(AuthActions.loginSuccess),
      tap(() => {
        toastService.showSuccess('Login successful!');
        router.navigate(['/administrator/dashboard']);
      })
    );
  },
  { functional: true, dispatch: false }
);

export const loginFailure$ = createEffect(
  (actions$ = inject(Actions), toastService = inject(ToastService)) => {
    return actions$.pipe(
      ofType(AuthActions.loginFailure),
      tap((action) => {
        toastService.showError(action.error || 'Login failed');
      })
    );
  },
  { functional: true, dispatch: false }
);

// Make sure to include all effects in the AuthEffects object
export const AuthEffects = { login$, loginSuccess$, loginFailure$ };