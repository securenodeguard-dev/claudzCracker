import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models/category.model';
import { SiteSettings } from '../../models/site-settings.model';
import { Product } from '../../models/product.model';
import { resolveImageUrl } from '../../shared/resolve-image-url';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  categories: Category[] = [];
  settings: SiteSettings | null = null;
  loading = true;
  offerProducts: Product[] = [];

  ngOnInit() {
    this.api.getSiteSettings().subscribe({ next: (s) => (this.settings = s) });
    this.api.getCategories().subscribe({
      next: (c) => {
        this.categories = c;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
    this.api.getProducts().subscribe({
      next: (products) => (this.offerProducts = products.filter((product) => product.priceMode === 'offer').slice(0, 4)),
    });
  }

  resolveCategoryIcon(name: string): string {
    const value = name.toLowerCase();
    if (value.includes('spark')) return '✦';
    if (value.includes('rocket')) return '↗';
    if (value.includes('flower') || value.includes('pot')) return '✹';
    if (value.includes('gift') || value.includes('box')) return '▣';
    return '✷';
  }

  getSavings(product: Product): number | null {
    if (product.priceMode !== 'offer' || product.originalPrice == null || product.offerPrice == null) return null;
    return Math.max(0, product.originalPrice - product.offerPrice);
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }
}
