import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './components/about/about.component';
import { AdminComponent } from './components/admin/admin.component';
import { ContactComponent } from './components/contact/contact.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import {
  DetailProductComponent
} from './components/detail-product/detail-product.component';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminGuardFn } from './guards/admin.guard';
import { AuthGuardFn } from './guards/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { ServiceComponent } from './components/service/service.component';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'products/:id', component: DetailProductComponent },
      { path: 'orders', component: OrderComponent },
      { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
      { path: 'orders/:id', component: OrderDetailComponent },
      { path: 'about', component: AboutComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'services', component: ServiceComponent },
      { path: '**', component: PageNotFoundComponent }
    ],
  },
  //Admin
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardFn]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
