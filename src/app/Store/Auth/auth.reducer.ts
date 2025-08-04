// src/app/store/auth/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.actions';

export interface AuthState {
  token: string | null;
  loading: boolean;
  isLoggedIn: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  token: null,
  loading: false,
  isLoggedIn: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
    isLoggedIn: false,
    error: null,
  })),
  on(AuthActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    loading: false,
    isLoggedIn: true,
  })),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
    isLoggedIn: false,
  })),
  on(AuthActions.logout, () => initialState)
);
