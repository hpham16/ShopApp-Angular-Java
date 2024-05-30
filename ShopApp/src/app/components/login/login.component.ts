import { Component, ViewChild } from '@angular/core';
import { LoginDTO } from '../../dtos/user/login.dto';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import {LoginResponse} from '../../responses/user/login.response';
import { Role } from '../../models/role';
import { RoleService } from 'src/app/services/role.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;


  phoneNumber: string = '1122223344';
  password: string = '123456';

  roles: Role[] = []; // Mảng roles
  rememberMe: boolean = true;
  selectedRole: Role | undefined; // Biến để lưu giá trị được chọn từ dropdown

  onPhoneNumberChange() {
    console.log(`Phone type: ${this.phoneNumber}`)
  }

  constructor(
    private router: Router, 
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService
  ) {}
    
  ngOnInit() {
    // Gọi API lấy danh sách roles và lưu vào biến roles
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => { // Sử dụng kiểu Role[]
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined;
      },
      error: (error: any) => {
        debugger
        console.error('Error getting roles:', error);
      }
    });
  }
  
  login() {
    const message = `phone: ${this.phoneNumber}` +
                    `password: ${this.password}`;
    debugger
    
    const loginDTO:LoginDTO = {
      phone_number: this.phoneNumber,
      password: this.password,
      role_id: this.selectedRole?.id ?? 1
    }
    
    this.userService.login(loginDTO).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const {token} = response;
        this.tokenService.setToken(token);
        //this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert(`Cannot register, error: ${error.error}`);
      }
    });
  }
}
