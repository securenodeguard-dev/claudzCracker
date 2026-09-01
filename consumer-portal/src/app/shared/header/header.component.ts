import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/site-settings.model';
import { resolveImageUrl } from '../resolve-image-url';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit {
  private api = inject(ApiService);
  settings: SiteSettings | null = null;
  menuOpen = false;

  ngOnInit() {
    this.api.getSiteSettings().subscribe({
      next: (s) => (this.settings = s),
      error: () => (this.settings = null),
    });
  }

  resolveLogoUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
