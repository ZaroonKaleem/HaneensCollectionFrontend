import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './Common/header/header.component';
import { FooterComponent } from './Common/footer/footer.component';
import { HomeComponent } from './Pages/home/home.component';
import { CommonModule } from '@angular/common';
import { WhatsappFloatIconComponent } from "./Common/whatsapp-float-icon/whatsapp-float-icon.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    WhatsappFloatIconComponent
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
