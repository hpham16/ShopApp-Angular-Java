import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './components/admin/admin.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import {
  DetailProductComponent
} from './components/detail-product/detail-product.component';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AuthGuardFn } from './guards/auth.guard';
//import { OrderAdminComponent } from './components/admin/order/order.admin.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products/:id', component: DetailProductComponent, data: { breadcrumb: 'Product Details' } },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  //Admin
  {
    path: 'admin',
    component: AdminComponent,
    // canActivate:[AdminGuardFn]
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
