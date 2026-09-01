import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);
  private orderService = inject(OrderService);

  loading = true;
  totalCategories = 0;
  activeCategories = 0;
  totalProducts = 0;
  activeProducts = 0;

  monthOrders = 0;
  pendingOrders = 0;
  confirmedOrders = 0;
  deliveredOrders = 0;
  monthlyEarnings = 0;
  maxStatusCount = 1;

  ngOnInit() {
    forkJoin([this.categoryService.list(), this.productService.list(), this.orderService.list()]).subscribe({
      next: ([categories, products, orders]) => {
        this.totalCategories = categories.length;
        this.activeCategories = categories.filter((c) => c.isActive).length;
        this.totalProducts = products.length;
        this.activeProducts = products.filter((p) => p.isActive).length;

        const now = new Date();
        const thisMonthOrders = orders.filter((order) => this.isCurrentMonth(order.createdAt));
        this.monthOrders = thisMonthOrders.length;
        this.pendingOrders = thisMonthOrders.filter((o) => (o.status || 'pending') === 'pending').length;
        this.confirmedOrders = thisMonthOrders.filter((o) => (o.status || 'pending') === 'confirmed').length;
        this.deliveredOrders = thisMonthOrders.filter((o) => (o.status || 'pending') === 'completed').length;
        this.monthlyEarnings = thisMonthOrders
          .filter((o) => (o.status || 'pending') === 'completed')
          .reduce((sum, order) => sum + (order.totalAmount || 0), 0);

        const counts = [this.pendingOrders, this.confirmedOrders, this.deliveredOrders].filter((count) => count > 0);
        this.maxStatusCount = counts.length ? Math.max(...counts, 1) : 1;

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  private isCurrentMonth(date?: string): boolean {
    if (!date) return false;
    const created = new Date(date);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }

  getBarWidth(value: number): number {
    return Math.max((value / this.maxStatusCount) * 100, value > 0 ? 12 : 0);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      default:
        return 'Delivered';
    }
  }
}
