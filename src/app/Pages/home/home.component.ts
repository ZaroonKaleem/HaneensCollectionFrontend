import { Component } from '@angular/core';
import { HeaderComponent } from '../../Common/header/header.component';
import { HeroComponent } from '../../Common/hero/hero.component';
import { FeaturedProductsComponent } from './featured-products/featured-products.component';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { InstaProductsComponent } from './insta-products/insta-products.component';
import { InfoCardsComponent } from './info-cards/info-cards.component';

@Component({
    selector: 'app-home',
    imports: [
        HeroComponent,
        FeaturedProductsComponent,
        NewsletterComponent,
        InstaProductsComponent,
        InfoCardsComponent
    ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent {

}
