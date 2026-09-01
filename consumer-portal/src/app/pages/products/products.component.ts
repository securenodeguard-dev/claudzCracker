import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { resolveImageUrl } from '../../shared/resolve-image-url';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  products: Product[] = [];
  categories: Category[] = [];
  activeCategory = '';
  searchTerm = '';
  loading = true;

  ngOnInit() {
    this.api.getCategories().subscribe({ next: (c) => (this.categories = c) });

    this.route.queryParams.subscribe((params) => {
      this.activeCategory = params['category'] || '';
      this.searchTerm = params['q'] || '';
      this.loadProducts();
    });
  }

  loadProducts() {
    this.loading = true;
    this.api
      .getProducts({ category: this.activeCategory || undefined, q: this.searchTerm || undefined })
      .subscribe({
        next: (p) => {
          this.products = p;
          this.loading = false;
        },
        error: () => (this.loading = false),
      });
  }

  selectCategory(slug: string) {
    this.router.navigate(['/products'], { queryParams: { category: slug || null, q: this.searchTerm || null } });
  }

  onSearch() {
    this.router.navigate(['/products'], { queryParams: { category: this.activeCategory || null, q: this.searchTerm || null } });
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }
}