import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.scss']
})
export class AvailableProductsComponent {
  @Output() selectedProducts: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input()
  availableProducts: any[] = [];

  products: any[] = [];

  constructor(private apiService: ApiServiceService) {}

  ngOnInit() {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
    });
  }

  toggleProductSelection(product: any) {
    if (product.selected) {
      this.selectedProducts.emit(this.products.filter(p => p.selected).map(p => p.sProductName));
    } else {

      this.selectedProducts.emit(this.products.filter(p => p.selected).map(p => p.sProductName));
    }
  }
}
