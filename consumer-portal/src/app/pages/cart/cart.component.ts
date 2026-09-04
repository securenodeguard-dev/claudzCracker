import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { SiteSettings } from '../../models/site-settings.model';
import { ApiService } from '../../services/api.service';
import { resolveImageUrl } from '../../shared/resolve-image-url';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent {
  private cart = inject(CartService);
  private http = inject(HttpClient);
  private api = inject(ApiService);

  items = this.cart.getItems();
  customerName = '';
  mobileNumber = '';
  whatsappNumber = '';
  address = '';
  source = 'Google Search';
  submitting = false;
  submitted = false;
  error = '';
  whatsappUrl = '';

  private settings: SiteSettings | null = null;

  constructor() {
    this.api.getSiteSettings().subscribe({ next: (settings) => (this.settings = settings) });
  }

  getTotal() {
    return this.cart.getTotal();
  }

  updateQuantity(productId: string, quantity: number) {
    this.cart.updateQuantity(productId, quantity);
    this.items = this.cart.getItems();
  }

  remove(productId: string) {
    this.cart.remove(productId);
    this.items = this.cart.getItems();
  }

  getPrice(product: Product): number {
    if (product.priceMode === 'offer') return product.offerPrice ?? product.price ?? 0;
    return product.price ?? 0;
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }

  submitOrder() {
    if (!this.customerName || !this.mobileNumber || this.items.length === 0) {
      this.error = 'Please enter customer name, mobile number and at least one product.';
      return;
    }

    this.submitting = true;
    this.error = '';

    const payload = {
      customerName: this.customerName,
      mobileNumber: this.mobileNumber,
      whatsappNumber: this.whatsappNumber,
      address: this.address,
      source: this.source,
      items: this.items.map((item) => ({
        productId: item.product._id,
        productName: item.product.name,
        quantity: item.quantity,
        unitPrice: this.getPrice(item.product),
        total: this.getPrice(item.product) * item.quantity,
      })),
    };

    this.http.post(`${environment.apiBaseUrl}/orders`, payload).subscribe({
      next: () => {
        this.submitting = false;
        this.submitted = true;
        this.whatsappUrl = this.buildWhatsappUrl(payload);
        this.cart.clear();
        this.items = [];
      },
      error: () => {
        this.submitting = false;
        this.error = 'Unable to place order right now. Please try again.';
      },
    });
  }

  private buildWhatsappUrl(payload: {
    customerName: string;
    mobileNumber: string;
    whatsappNumber: string;
    address: string;
    source: string;
    items: { productName: string; quantity: number; unitPrice: number; total: number }[];
  }): string {
    const businessNumber = (this.settings?.whatsapp || '').replace(/\D/g, '');
    if (!businessNumber) return '';

    const items = payload.items
      .map((item) => `- ${item.productName} x${item.quantity}: ₹${item.total}`)
      .join('\n');
    const message = [
      'New order request',
      `Name: ${payload.customerName}`,
      `Mobile: ${payload.mobileNumber}`,
      `WhatsApp: ${payload.whatsappNumber || 'Not provided'}`,
      `Address: ${payload.address || 'Not provided'}`,
      `Source: ${payload.source || 'Website'}`,
      '',
      'Items:',
      items,
      `Total: ₹${payload.items.reduce((total, item) => total + item.total, 0)}`,
    ].join('\n');

    return `https://wa.me/${businessNumber}?text=${encodeURIComponent(message)}`;
  }
}
