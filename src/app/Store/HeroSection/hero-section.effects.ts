import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { 
  saveHeroSection, 
  saveHeroSectionSuccess, 
  saveHeroSectionFailure,
  loadHeroSection,
  loadHeroSectionSuccess,
  loadHeroSectionFailure
} from './hero-section.actions';
import { environment } from '../../environments/environment';

@Injectable()
export class HeroSectionEffects {
  private actions$ = inject(Actions);
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  saveHeroSection$ = createEffect(() => 
    this.actions$.pipe(
      ofType(saveHeroSection),
      mergeMap(({ formData }) => 
        this.http.post<any>(`${this.apiUrl}/HeroSection`, formData).pipe(
          map(heroSection => saveHeroSectionSuccess({ heroSection })),
          catchError(error => of(saveHeroSectionFailure({ error: error.message })))
        )
      )
    ));

  loadHeroSection$ = createEffect(() => 
    this.actions$.pipe(
      ofType(loadHeroSection),
      mergeMap(() => 
        this.http.get<any>(`${this.apiUrl}/HeroSection/latest`).pipe(
          map(heroSection => loadHeroSectionSuccess({ heroSection })),
          catchError(error => of(loadHeroSectionFailure({ error: error.message })))
        )
      )
    ));
}