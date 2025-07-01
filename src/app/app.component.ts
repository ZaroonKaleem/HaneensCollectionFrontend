import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Common/header/header.component';
import { FooterComponent } from './Common/footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    imports: [
        CommonModule,
        RouterOutlet,
        HeaderComponent,
        HomeComponent,
        FooterComponent,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {
  title = `Haneen's Collection`;
    constructor(private router: Router) {}

  isAdminRoute(): boolean {
    return this.router.url.startsWith('/administrator');
  }
}
