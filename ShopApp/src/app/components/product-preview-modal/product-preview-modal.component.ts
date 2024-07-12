import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-preview-modal',
  standalone: true,
  imports: [],
  templateUrl: './product-preview-modal.component.html',
  styleUrl: './product-preview-modal.component.scss'
})
export class ProductPreviewModalComponent {
  @Input() product: any;

  constructor(public activeModal: NgbActiveModal) { }
}
