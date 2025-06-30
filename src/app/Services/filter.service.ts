import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private openModalSource = new Subject<void>();
  private filtersChangedSource = new Subject<any>();
  private sortChangedSource = new Subject<string>();

  openModal$ = this.openModalSource.asObservable();
  filtersChanged$ = this.filtersChangedSource.asObservable();
  sortChanged$ = this.sortChangedSource.asObservable();

  openModal() {
    this.openModalSource.next();
  }

  emitFiltersChanged(filters: any) {
    this.filtersChangedSource.next(filters);
  }

  emitSortChanged(sortOption: string) {
    this.sortChangedSource.next(sortOption);
  }
}