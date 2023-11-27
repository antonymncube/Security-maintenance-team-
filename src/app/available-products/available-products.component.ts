import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.component.html',
  styleUrls: ['./available-products.component.scss']
})
export class AvailableProductsComponent implements OnInit {
  @Output() selectedProducts: EventEmitter<string[]> = new EventEmitter<string[]>();
  @Input() availableProducts: string[] = [];
  products: any[] = []; // Assuming you have an array of products
  selectAll: boolean = false;


  constructor(private apiService: ApiServiceService) {}

  ngOnInit() {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data.map((product: any) => ({
        ...product,
        selected: this.availableProducts.includes(product.sProductName)
      }));
      this.selectedProducts.emit(this.availableProducts);
    });
  }


  toggleProductSelection(product: any) {
    product.selected = !product.selected;

    const selectedProductNames = this.products
      .filter((p) => p.selected)
      .map((p) => p.sProductName);

    this.selectedProducts.emit(selectedProductNames);
  
  }
  toggleSelectAll(): void {
    this.selectAll = !this.selectAll;
    this.products.forEach((product) => {
      product.selected = this.selectAll;
    });

}
}
