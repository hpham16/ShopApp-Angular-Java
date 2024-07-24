import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { NgbModule, NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [NgbModule, NgbToastModule, CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent implements OnDestroy {
  toastService = inject(ToastService);
  ngOnDestroy(): void {
    this.toastService.clear();
  }
}
