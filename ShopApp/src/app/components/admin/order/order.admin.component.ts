import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { ToastService } from './../../../services/toast.service';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss']
})
export class OrderAdminComponent implements OnInit {
  @ViewChild('deleteModal') deleteModal!: TemplateRef<any>;

  orders: OrderResponse[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 12;
  totalPages: number = 0;
  keyword: string = "";
  orderToDelete!: any;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.currentPage = Number(localStorage.getItem('currentOrderAdminPage')) || 1;
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  searchOrders() {
    this.currentPage = 1;
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }

  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page - 1, limit).subscribe({
      next: (response: any) => {
        this.orders = response.orders;
        this.totalPages = response.totalPages;
      },
      error: (error: any) => {
        console.error('Error fetching orders:', error);
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    localStorage.setItem('currentOrderAdminPage', String(this.currentPage));
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  openDeleteModal(order: OrderResponse) {
    this.orderToDelete = order;
    this.modalService.open(this.deleteModal, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        if (result === 'delete') {
          this.deleteOrder();
        }
      },
      (reason) => {
        this.orderToDelete = null;
      }
    );
    console.log(this.orderToDelete)
  }

  confirmDelete() {
    this.deleteOrder();
    this.modalService.dismissAll('delete');
  }

  deleteOrder() {
    if (this.orderToDelete) {
      this.orderService.deleteOrder(this.orderToDelete.id).subscribe({
        next: (res) => {
          console.log(res)
          this.toastService.show('Success', 'Delete order successfully !', 'bg-success text-light');
          this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
        },
        error: (error: any) => {
          console.error('Error deleting order:', error);
        },
        complete: () => {
        }
      });
    }
  }

  viewDetails(order: OrderResponse) {
    this.router.navigate(['/admin/orders', order.id]);
  }
}
