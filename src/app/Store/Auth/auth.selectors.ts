import { createSelector } from "@ngrx/store";
import { AuthState } from "./auth.reducer";

// src/app/store/auth/auth.selectors.ts
export const selectAuthState = (state: { auth: AuthState }) => state.auth;

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state: AuthState) => state.error
);

export const selectAuthToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.token
);
export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state: AuthState) => state.isLoggedIn
);

