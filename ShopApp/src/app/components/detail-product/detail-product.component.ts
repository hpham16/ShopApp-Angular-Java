import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { ProductImage } from '../../models/product.image';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss']
})

export class DetailProductComponent implements OnInit {
  product!: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isPressedAddToCart: boolean = false;

  products: Product[] = [
    {
      id: 1,
      name: 'SOCIIOLA COLLECTION',
      price: 90000,
      thumbnail: 'assets/images/product1-thumbnail.jpg',
      description: 'Bông Tẩy Trang Không Ngâm Tắm Hóa Chất - Trọn Vẹn',
      category_id: 1,
      url: 'product1-url',
      product_images: [
      ]
    },
    {
      id: 2,
      name: 'COCOON',
      price: 295000,
      thumbnail: 'assets/images/product2-thumbnail.jpg',
      description: 'Nước Hoa Sen Hậu Giang Cocoon Lotus Soothing Toner',
      category_id: 2,
      url: 'product2-url',
      product_images: [
      ]
    },
    {
      id: 3,
      name: 'SKINTIFIC',
      price: 380000,
      thumbnail: 'assets/images/product3-thumbnail.jpg',
      description: 'Combo 2 Thanh Lăn Mặt Nạ Đất Sét Ngải Cứu Skintific',
      category_id: 3,
      url: 'product3-url',
      product_images: [
      ]
    }
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    // private categoryService: CategoryService,
    // private router: Router,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {

  }
  ngOnInit() {
    // Lấy productId từ URL
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');

    //this.cartService.clearCart();
    //const idParam = 9 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          }

          this.product = response
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
        },
        error: (error: any) => {
          console.error('Error fetching detail:', error);
        }
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  // getProductByCatagoryId(category: number) {
  //   this.productService.getProductByCategoryId(category).subscribe((res: any) => {
  //     console.log(res)
  //   })
  // }

  showImage(index: number): void {

    if (this.product && this.product.product_images &&
      this.product.product_images.length > 0) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {

    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  nextImage(): void {

    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {

    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {

    this.isPressedAddToCart = true;
    if (this.product) {
      this.cartService.addToCart(this.product.id, this.quantity);
    } else {
      // Xử lý khi product là null
      console.error('Không thể thêm sản phẩm vào giỏ hàng vì product là null.');
    }
  }

  increaseQuantity(): void {

    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  getTotalPrice(): number {
    if (this.product) {
      return this.product.price * this.quantity;
    }
    return 0;
  }

  buyNow(): void {
    if (this.isPressedAddToCart == false) {
      this.addToCart();
    }
    this.router.navigate(['/orders']);
  }
}
