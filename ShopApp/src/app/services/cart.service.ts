import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Map<number, number> = new Map<number, number>(); // Use Map to store cart items, key is product id, value is quantity
  private cartSubject: BehaviorSubject<Map<number, number>> = new BehaviorSubject<Map<number, number>>(this.cart);

  constructor() {
    this.refreshCart(); // Load cart data from localStorage when service is initialized
  }

  public refreshCart() {
    const storedCart = localStorage.getItem(this.getCartKey());
    if (storedCart) {
      this.cart = new Map(JSON.parse(storedCart));
    } else {
      this.cart = new Map<number, number>();
    }
    this.cartSubject.next(this.cart); // Emit the updated cart
  }

  private getCartKey(): string {
    const userResponseJSON = localStorage.getItem('user');
    const userResponse = JSON.parse(userResponseJSON!);
    return `cart:${userResponse?.id ?? ''}`;
  }

  addToCart(productId: number, quantity: number = 1): void {
    if (this.cart.has(productId)) {
      // If the product is already in the cart, increase the quantity by `quantity`
      this.cart.set(productId, this.cart.get(productId)! + quantity);
    } else {
      // If the product is not in the cart, add it with quantity `quantity`
      this.cart.set(productId, quantity);
    }
    this.saveCartToLocalStorage(); // Save cart to localStorage after modification
    this.cartSubject.next(this.cart); // Emit the updated cart
  }

  getCart(): Map<number, number> {
    return this.cart;
  }

  getCartObservable() {
    return this.cartSubject.asObservable(); // Expose the cart as an observable
  }

  private saveCartToLocalStorage(): void {
    localStorage.setItem(this.getCartKey(), JSON.stringify(Array.from(this.cart.entries())));
  }

  setCart(cart: Map<number, number>): void {
    this.cart = cart ?? new Map<number, number>();
    this.saveCartToLocalStorage();
    this.cartSubject.next(this.cart); // Emit the updated cart
  }

  clearCart(): void {
    this.cart.clear(); // Clear all items from the cart
    this.saveCartToLocalStorage(); // Save empty cart to localStorage
    this.cartSubject.next(this.cart); // Emit the updated cart
  }
}
