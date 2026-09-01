import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/admin/products`;

  list() {
    return this.http.get<Product[]>(this.base);
  }
  get(id: string) {
    return this.http.get<Product>(`${this.base}/${id}`);
  }
  create(data: Partial<Product>) {
    return this.http.post<Product>(this.base, data);
  }
  update(id: string, data: Partial<Product>) {
    return this.http.patch<Product>(`${this.base}/${id}`, data);
  }
  archive(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
}
