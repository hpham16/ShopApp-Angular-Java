import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductPreviewModalComponent } from './product-preview-modal.component';

describe('ProductPreviewModalComponent', () => {
  let component: ProductPreviewModalComponent;
  let fixture: ComponentFixture<ProductPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductPreviewModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
