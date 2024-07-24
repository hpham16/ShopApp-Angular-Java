import { Component, ViewChild, OnInit } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { RoleService } from '../../services/role.service'; // Import RoleService
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoginResponse } from '../../responses/user/login.response';
import { Role } from '../../models/role'; // Path to the Role model
import { UserResponse } from '../../responses/user/user.response';
import { CartService } from '../../services/cart.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RegisterComponent } from '../register/register.component';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('loginForm') loginForm!: NgForm;

  phoneNumber: string = '33445566';
  password: string = '123456789';
  showPassword: boolean = false;

  roles: Role[] = []; // Array of roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Variable to store selected role
  userResponse?: UserResponse

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
    private cartService: CartService,
    private toastService: ToastService) { }

  ngOnInit() {
    // Call API to get list of roles and store in roles variable
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Use Role[] type
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        console.error('Error getting roles:', error);
      }
    });
  }

  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }

  createAccount() {
    // Redirect user to register page (or create account page)
    this.activeModal.dismiss();
    this.modalService.open(RegisterComponent, { size: 'lg' });
  }

  login() {
    const loginDTO: LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    };

    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        const { token } = response;
        if (this.rememberMe) {
          this.tokenService.setToken(token);
          this.userService.getUserDetail(token).subscribe({
            next: (response: any) => {
              this.userResponse = {
                ...response,
                date_of_birth: new Date(response.date_of_birth),
              };
              this.userService.saveUserResponseToLocalStorage(this.userResponse);
              if (this.userResponse?.role.name == 'admin') {
                this.router.navigate(['/admin']);
              } else if (this.userResponse?.role.name == 'user') {
                this.router.navigate(['/']);
              }
              this.toastService.show('Success', 'This is a success message', 'bg-success text-light');

            },
            complete: () => {
              this.cartService.refreshCart();
            },
            error: (error: any) => {
              alert(error.error.message);
            }
          });
        }
        this.activeModal.close();
      },
      error: (error: any) => {
        alert(error.error.message);
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  signInWithGoogle() {
    this.userService.signInWithGoogle().then((result) => {
      console.log('Google sign in successful', result);
      this.activeModal.close();
    }).catch((error) => {
      console.error('Google sign in error', error);
    });
  }

  signInWithFacebook() {
    this.userService.signInWithFacebook().then((result) => {
      console.log('Facebook sign in successful', result);
      this.activeModal.close();
    }).catch((error) => {
      console.error('Facebook sign in error', error);
    });
  }
}
