import { CommonModule } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbDropdownModule, NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { environment } from 'src/environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/app.component';
import { AdminModule } from './components/admin/admin.module';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { CarouselComponent } from './components/carousel/carousel.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { OrderDetailComponent } from './components/detail-order/order.detail.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { OrderComponent } from './components/order/order.component';
import { ProductCardItemComponent } from './components/product-card-item/product-card-item.component';
import { RegisterComponent } from './components/register/register.component';
import { TabContentComponent } from './components/tab-content/tab-content.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@NgModule({
  declarations: [
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    DetailProductComponent,
    OrderComponent,
    OrderDetailComponent,
    LoginComponent,
    RegisterComponent,
    UserProfileComponent,
    AppComponent,
    CarouselComponent,
    ProductCardItemComponent,
    CommentListComponent,
    TabContentComponent,
    BreadcrumbsComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgbModule,
    NgbDropdownModule,
    AdminModule,
    CarouselModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    ToastContainerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true,
    },
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
