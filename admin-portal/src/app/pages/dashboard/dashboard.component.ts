import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  loading = true;
  totalCategories = 0;
  activeCategories = 0;
  totalProducts = 0;
  activeProducts = 0;

  ngOnInit() {
    forkJoin([this.categoryService.list(), this.productService.list()]).subscribe({
      next: ([categories, products]) => {
        this.totalCategories = categories.length;
        this.activeCategories = categories.filter((c) => c.isActive).length;
        this.totalProducts = products.length;
        this.activeProducts = products.filter((p) => p.isActive).length;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
