import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { LoginComponent } from '../login/login.component';
import { NgbModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;

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
