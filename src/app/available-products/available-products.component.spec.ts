import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailableProductsComponent } from './available-products.component';

describe('AvailableProductsComponent', () => {
  let component: AvailableProductsComponent;
  let fixture: ComponentFixture<AvailableProductsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvailableProductsComponent]
    });
    fixture = TestBed.createComponent(AvailableProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
