import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';
import { SiteSettings } from '../models/site-settings.model';

// Thin wrapper around HttpClient for all public (unauthenticated) endpoints
// the consumer portal needs. Keeping this centralized makes it trivial to
// swap the base URL per environment (see src/environments/*).
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getCategories() {
    return this.http.get<Category[]>(`${this.base}/categories`);
  }

  getCategory(slug: string) {
    return this.http.get<Category>(`${this.base}/categories/${slug}`);
  }

  getProducts(params?: { category?: string; q?: string }) {
    let query = '';
    if (params?.category || params?.q) {
      const usp = new URLSearchParams();
      if (params.category) usp.set('category', params.category);
      if (params.q) usp.set('q', params.q);
      query = `?${usp.toString()}`;
    }
    return this.http.get<Product[]>(`${this.base}/products${query}`);
  }

  getProduct(slug: string) {
    return this.http.get<Product>(`${this.base}/products/${slug}`);
  }

  getSiteSettings() {
    return this.http.get<SiteSettings>(`${this.base}/site-settings/public`);
  }
}
