import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from '../models/auth.model';

const TOKEN_KEY = 'cracker_shop_admin_token';
const ADMIN_KEY = 'cracker_shop_admin_profile';

// Auth state lives client-side for UX only (showing the logged-in admin's
// name, gating Angular routes). The backend independently re-validates the
// JWT on every request — the Angular guard is a convenience, not security.
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private base = environment.apiBaseUrl;

  isLoggedIn = signal<boolean>(!!localStorage.getItem(TOKEN_KEY));

  login(email: string, password: string) {
    return this.http.post<LoginResponse>(`${this.base}/auth/login`, { email, password }).pipe(
      tap((res) => {
        localStorage.setItem(TOKEN_KEY, res.accessToken);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(res.admin));
        this.isLoggedIn.set(true);
      }),
    );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
    this.isLoggedIn.set(false);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  getAdmin(): { id: string; name: string; email: string; role: string } | null {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  }
}
