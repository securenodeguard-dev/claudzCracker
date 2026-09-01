import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { SiteSettings } from '../models/site-settings.model';

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private http = inject(HttpClient);
  private base = `${environment.apiBaseUrl}/admin/site-settings`;

  get() {
    return this.http.get<SiteSettings>(this.base);
  }
  update(data: Partial<SiteSettings>) {
    return this.http.patch<SiteSettings>(this.base, data);
  }
}
