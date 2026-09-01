import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Order, OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private orderService = inject(OrderService);

  orders: Order[] = [];
  loading = true;
  statusOptions: Array<'pending' | 'confirmed' | 'completed'> = ['pending', 'confirmed', 'completed'];

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.orderService.list().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  updateStatus(order: Order, status: 'pending' | 'confirmed' | 'completed') {
    if (!order?._id) return;
    this.orderService.updateStatus(order._id, status).subscribe({
      next: () => this.load(),
      error: () => this.load(),
    });
  }
}
