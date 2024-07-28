import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnalyticsService, CartService, CategoryService, ProductService } from 'src/app/services';
import { environment } from '../../../environments/environment';
import { Category } from '../../models/category';
import { Product } from '../../models/product';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private cartService: CartService,
    private analyticsService: AnalyticsService
  ) { }



  ngOnInit() {
    this.analyticsService.trackEvent('load page', 'visited', 'test')
    this.currentPage = Number(localStorage.getItem('currentProductPage')) || 0;
    this.loadProducts();
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (categories: Category[]) => {
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
      }
    });
  }

  searchProducts() {
    this.currentPage = 0;
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage).subscribe({
      next: (response: any) => {
        response.products.forEach((product: Product) => {
          product.url = product.thumbnail ? `${environment.apiBaseUrl}/products/images/${product.thumbnail}` : 'assets/img/no-image.svg';
        });
        this.products = response.products;
        this.totalPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = Math.max(page, 0);
    localStorage.setItem('currentProductPage', String(this.currentPage));
    this.loadProducts();
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    return Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);
  }

  onProductClick(productId: number) {
    this.router.navigate(['/products', productId]);
  }

  addToCart(product: any) {
    this.cartService.addToCart(product.id);
  }

  openQuickView(product: any) {

  }
}
