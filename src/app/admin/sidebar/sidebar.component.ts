import { Component } from '@angular/core';
import { SidebarService } from '../../Services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sidebar',
    imports: [
        CommonModule,
        RouterLink,
    ],
    templateUrl: './sidebar.component.html',
    styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(public sidebarService: SidebarService) {} // Added public accessor

}
