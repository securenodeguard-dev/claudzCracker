import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/site-settings.model';
import { resolveImageUrl } from '../resolve-image-url';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent implements OnInit {
  private api = inject(ApiService);
  settings: SiteSettings | null = null;
  year = new Date().getFullYear();

  resolveLogoUrl(url?: string | null): string {
    return resolveImageUrl(url || '/assets/logo.jpg');
  }

  ngOnInit() {
    this.api.getSiteSettings().subscribe({
      next: (s) => (this.settings = s),
      error: () => (this.settings = null),
    });
  }
}
