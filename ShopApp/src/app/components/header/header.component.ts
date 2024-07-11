import { Component, HostListener, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { Router } from '@angular/router';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { UserResponse } from '../../responses/user/user.response';
import { TokenService } from '../../services/token.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  isScrolled = false;
  constructor(
    private modalService: NgbModal,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
  ) {

  }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
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
  // togglePopover(event: Event): void {
  //   event.preventDefault();
  //   this.isPopoverOpen = !this.isPopoverOpen;
  // }

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
    console.log(index)
    this.activeNavItem = index;
    //alert(this.activeNavItem);
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
}
