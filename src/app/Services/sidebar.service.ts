// sidebar.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private isOpen = new BehaviorSubject<boolean>(true);
  isOpen$ = this.isOpen.asObservable();

  toggle() {
    this.isOpen.next(!this.isOpen.value);
  }
}