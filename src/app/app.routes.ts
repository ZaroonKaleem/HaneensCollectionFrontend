import { Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { ProductsComponent } from './Pages/products/products.component';
import { PretComponent } from './Pages/pret/pret.component';
import { UnstichedComponent } from './Pages/unstiched/unstiched.component';
import { StitchedComponent } from './Pages/stitched/stitched.component';
import { LuxuryComponent } from './Pages/luxury/luxury.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { AdminComponent } from './admin/admin.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { SignInComponent } from './admin/sign-in/sign-in.component';
import { HeroSectionEditorComponent } from './admin/hero-section-editor/hero-section-editor.component';
import { InstagramProductsEditorComponent } from './admin/instagram-products-editor/instagram-products-editor.component';
import { AddFeaturedProductsComponent } from './admin/add-featured-products/add-featured-products.component';
import { ProductDetailsComponent } from './Pages/home/featured-products/product-details/product-details.component';
import { UnstitchedSuitFormComponent } from './admin/unstitched-suit-form/unstitched-suit-form.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home | HC' },
  {
    path: 'product/:id',  // Dynamic route parameter for product ID
    component: ProductDetailsComponent,
    title: 'Product Details'
  },
  { path: 'women', component: ProductsComponent, title: 'Women | HC' },
  { path: 'pret', component: PretComponent, title: 'Pret | HC' },
  { path: 'unstitched', component: UnstichedComponent, title: 'unstitched | HC' },
  { path: 'stitched', component: StitchedComponent, title: 'Stiched | HC' },
  { path: 'luxury', component: LuxuryComponent, title: 'Luxury | HC' },
  { path: 'Sale', component: SaleComponent, title: 'Sale | HC' },

 {
    path: 'administrator',
    children: [
      { path: '', component: SignInComponent, title: 'Login | HC' },
      {
        path: '',
        component: AdminComponent,
        // canActivate: [AuthGuard],
        children: [
          { path: 'dashboard', component: DashboardComponent, title: 'Dashboard | HC' },
          { path: 'hero-editor', component: HeroSectionEditorComponent, title: 'Hero Section Edit | HC' },
          { path: 'instagram-products-management', component: InstagramProductsEditorComponent, title: 'Instagram | HC' },
          { path: 'featured-products-management', component: AddFeaturedProductsComponent, title: 'Featured Products | HC' },
          { path: 'unstitched-suit-management', component: UnstitchedSuitFormComponent, title: 'Unstitched Suits | HC'},
        ]
      }
    ]
  }
];
