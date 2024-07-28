import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services';
import { CartService } from 'src/app/services/cart.service';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';

interface NavItem {
  name: string;
  route: string;
  icon?: string;
}


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, RouterModule],
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  isScrolled = false;
  itemCount: number = 0;
  navItems: NavItem[] = [
    { name: 'Trang chủ', route: '/', icon: '' },
    { name: 'Giỏ hàng', route: '/orders', icon: 'fas fa-shopping-cart' },
    { name: 'Về chúng tôi', route: '/about', icon: 'fa-solid fa-circle-info' },
    { name: 'Dịch vụ', route: '/services', icon: 'fas fa-concierge-bell' },
    { name: 'Liên hệ', route: '/contact', icon: 'fas fa-envelope' },
  ];
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
    this.userService.user$.subscribe(user => {
      this.userResponse = user;
    });
    this.cartService.getCartObservable().subscribe(cart => {
      this.itemCount = Array.from(cart.values()).reduce((sum, qty) => sum + qty, 0);
    });
  }

  private updateItemCount() {
    this.itemCount = Array.from(this.cartService.getCart().values()).reduce((sum, qty) => sum + qty, 0);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 0;
  }

  togglePopover(p: NgbPopover): void {
    if (p.isOpen()) {
      p.close();
    } else {
      p.open();
    }
  }

  handleItemClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = null;
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item
  }

  setActiveNavItem(index: number) {
    this.activeNavItem = index;
  }

  openLoginModal() {
    this.modalService.open(LoginComponent, { size: 'lg' });
  }

  signOut() {
    this.userService.signOut().then(() => {
      this.userService.removeUserFromLocalStorage();
      this.userResponse = null;
      this.router.navigate(['/']);
    });
  }
  createAccount() {
    // Redirect user to register page (or create account page)
    //this.activeModal.dismiss();
    this.modalService.open(RegisterComponent, { size: 'lg' });
  }
}
