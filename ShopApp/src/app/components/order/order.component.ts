import { Component, OnInit, ViewChild, inject, viewChild } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { environment } from '../../../environments/environment';
import { OrderDTO } from '../../dtos/order/order.dto';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from '../../models/order';
import { ApiResponse } from 'src/app/responses/api.response';
import { CouponService } from '../../services/coupon.service';
import { UserService } from 'src/app/services/user.service';
import { UserResponse } from 'src/app/responses/user/user.response';
import { LoginComponent } from '../login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  private couponService = inject(CouponService);
  private cartService = inject(CartService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);
  private tokenService = inject(TokenService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  orderForm: FormGroup; // Đối tượng FormGroup để quản lý dữ liệu của form
  cartItems: { product: Product, quantity: number }[] = [];
  totalAmount: number = 0; // Tổng tiền
  totalAmount2: number = 0; // Tổng tiền
  couponDiscount: number = 0; //số tiền được discount từ coupon
  couponApplied: boolean = false;
  cart: Map<number, number> = new Map();
  orderData: OrderDTO = {
    user_id: 0, // Thay bằng user_id thích hợp
    fullname: '', // Khởi tạo rỗng, sẽ được điền từ form
    email: '', // Khởi tạo rỗng, sẽ được điền từ form
    phone_number: '', // Khởi tạo rỗng, sẽ được điền từ form
    address: '', // Khởi tạo rỗng, sẽ được điền từ form
    status: 'pending',
    note: '', // Có thể thêm trường ghi chú nếu cần
    total_money: 0, // Sẽ được tính toán dựa trên giỏ hàng và mã giảm giá
    payment_method: 'cod', // Mặc định là thanh toán khi nhận hàng (COD)
    shipping_method: 'express', // Mặc định là vận chuyển nhanh (Express)
    coupon_code: '', // Sẽ được điền từ form khi áp dụng mã giảm giá
    cart_items: []
  };
  userResponse!: UserResponse;

  constructor(private userService: UserService, private modalService: NgbModal) {
    // Tạo FormGroup và các FormControl tương ứng
    this.orderForm = this.formBuilder.group({
      fullname: ['', Validators.required], // fullname là FormControl bắt buộc
      email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
      phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
      address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
      note: [''],
      couponCode: [''],
      shipping_method: ['express'],
      payment_method: ['cod']
    });
  }
  ngOnInit(): void {
    this.userService.user$.subscribe(user => {
      this.userResponse = user;
    });
    //this.cartService.clearCart();
    this.orderData.user_id = this.tokenService.getUserId();
    // Lấy danh sách sản phẩm từ giỏ hàng

    this.cart = this.cartService.getCart();
    const productIds = Array.from(this.cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng

    // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID

    if (productIds.length === 0) {
      return;
    }
    this.productService.getProductsByIds(productIds).subscribe({
      next: (products) => {

        // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
        this.cartItems = productIds.map((productId) => {

          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = product.thumbnail ? `${environment.apiBaseUrl}/products/images/${product.thumbnail}` : 'assets/img/no-image.svg';
          }
          return {
            product: product!,
            quantity: this.cart.get(productId)!
          };
        });
        console.log('haha');
      },
      complete: () => {
        ;
        this.calculateTotal()
        this.calculateTotal2()
      },
      error: (error: any) => {
        ;
        console.error('Error fetching detail:', error);
      }
    });
  }
  placeOrder() {
    if (!this.userResponse) {
      this.modalService.open(LoginComponent, { size: 'lg' });
    }
    if (this.orderForm.errors == null) {
      // Gán giá trị từ form vào đối tượng orderData
      /*
      this.orderData.fullname = this.orderForm.get('fullname')!.value;
      this.orderData.email = this.orderForm.get('email')!.value;
      this.orderData.phone_number = this.orderForm.get('phone_number')!.value;
      this.orderData.address = this.orderForm.get('address')!.value;
      this.orderData.note = this.orderForm.get('note')!.value;
      this.orderData.shipping_method = this.orderForm.get('shipping_method')!.value;
      this.orderData.payment_method = this.orderForm.get('payment_method')!.value;
      */
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      this.orderData.total_money = this.totalAmount;
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response: Order) => {
          ;
          alert('Đặt hàng thành công');
          this.cartService.clearCart();
          this.router.navigate(['/']);
        },
        complete: () => {
          ;
          this.calculateTotal();
          this.calculateTotal2();
        },
        error: (error: any) => {
          ;
          alert(`Lỗi khi đặt hàng: ${error}`);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  decreaseQuantity(index: number): void {
    if (this.cartItems[index].quantity > 1) {
      this.cartItems[index].quantity--;
      // Cập nhật lại this.cart từ this.cartItems
      this.updateCartFromCartItems();
      this.calculateTotal2();
      this.updateTotalWithCoupon();
    }
  }

  increaseQuantity(index: number): void {
    this.cartItems[index].quantity++;
    // Cập nhật lại this.cart từ this.cartItems
    this.updateCartFromCartItems();
    this.calculateTotal2();
    this.updateTotalWithCoupon();
  }

  // Hàm tính tổng tiền
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  calculateTotal2(): void {
    this.totalAmount2 = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  }
  confirmDelete(index: number): void {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      this.cartItems.splice(index, 1);
      this.updateCartFromCartItems();
      this.calculateTotal2();
      this.updateTotalWithCoupon();
    }
  }
  // Hàm xử lý việc áp dụng mã giảm giá
  applyCoupon(): void {
    const couponCode = this.orderForm.get('couponCode')!.value;
    if (!this.couponApplied && couponCode) {
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (response) => {
            this.totalAmount = response.result;
            this.couponApplied = true;
            this.calculateCouponDiscount();
          },
          error: (error) => {

            console.error('Error calculating coupon value:', error);
            // Xử lý lỗi ở đây nếu cần thiết
          },
        });

    }
  }
  updateTotalWithCoupon(): void {
    this.calculateTotal();
    if (this.couponApplied) {
      const couponCode = this.orderForm.get('couponCode')!.value;
      this.couponService.calculateCouponValue(couponCode, this.totalAmount)
        .subscribe({
          next: (response) => {
            this.totalAmount = response.result;
            this.calculateCouponDiscount();
          },
          error: (error) => {
            console.error('Error calculating coupon value:', error);
            // Xử lý lỗi ở đây nếu cần thiết
          }
        });
    }
  }
  private calculateCouponDiscount(): void {
    this.couponDiscount = 0;

    this.couponDiscount = this.totalAmount2 - this.totalAmount;
  }

  private updateCartFromCartItems(): void {
    this.cart.clear();
    this.cartItems.forEach((item) => {
      this.cart.set(item.product.id, item.quantity);
    });
    this.cartService.setCart(this.cart);
  }
}
