import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/site-settings.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  private api = inject(ApiService);
  settings: SiteSettings | null = null;

  ngOnInit() {
    this.api.getSiteSettings().subscribe({ next: (s) => (this.settings = s) });
  }

  getGoogleMapsEmbedUrl(): string {
    if (!this.settings?.googleMapsUrl && !this.settings?.address) return '';

    const raw = (this.settings?.googleMapsUrl || '').trim();
    const searchTarget = (this.settings?.address || raw || 'store location').trim();

    if (raw && (raw.includes('maps.app.goo.gl') || raw.includes('goo.gl'))) {
      return `https://www.google.com/maps?q=${encodeURIComponent(searchTarget)}&output=embed&z=15`;
    }

    if (raw && (raw.includes('maps.google') || raw.includes('google.com/maps'))) {
      try {
        const mapUrl = new URL(raw.startsWith('http') ? raw : `https://www.google.com/maps?q=${encodeURIComponent(raw)}`);
        mapUrl.searchParams.set('output', 'embed');
        mapUrl.searchParams.set('z', '15');
        return mapUrl.toString();
      } catch {
        return `https://www.google.com/maps?q=${encodeURIComponent(searchTarget)}&output=embed&z=15`;
      }
    }

    return `https://www.google.com/maps?q=${encodeURIComponent(searchTarget)}&output=embed&z=15`;
  }
}
