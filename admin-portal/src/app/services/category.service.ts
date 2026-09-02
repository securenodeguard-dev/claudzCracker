import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/admin/categories`;

  list() {
    return this.http.get<Category[]>(this.base);
  }
  create(data: Partial<Category>) {
    return this.http.post<Category>(this.base, data);
  }
  update(id: string, data: Partial<Category>) {
    return this.http.patch<Category>(`${this.base}/${id}`, data);
  }
  deactivate(id: string) {
    return this.http.delete(`${this.base}/${id}`);
  }
  // Permanently remove (hard delete) the category from the DB
  remove(id: string) {
    return this.http.delete(`${this.base}/${id}/hard`);
  }
}
