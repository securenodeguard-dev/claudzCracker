import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { SiteSettings } from '../../models/site-settings.model';
import { resolveImageUrl } from '../../shared/resolve-image-url';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css',
})
export class ProductDetailsComponent implements OnInit {
  private api = inject(ApiService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  product: Product | null = null;
  settings: SiteSettings | null = null;
  loading = true;
  notFound = false;
  videoOpen = false;

  ngOnInit() {
    this.api.getSiteSettings().subscribe({ next: (s) => (this.settings = s) });
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.api.getProduct(slug).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  getDisplayPrice(): string {
    if (!this.product || !this.product.showPrice) return '—';
    if (this.product.priceMode === 'offer') {
      const offer = this.product.offerPrice ?? this.product.price;
      const original = this.product.originalPrice ?? this.product.price;
      return offer != null ? `₹${offer}` : original != null ? `₹${original}` : '—';
    }
    return this.product.price != null ? `₹${this.product.price}` : '—';
  }

  getOriginalPrice(): number | null {
    if (!this.product) return null;
    if (this.product.priceMode === 'offer') return this.product.originalPrice ?? this.product.price ?? null;
    return this.product.price ?? null;
  }

  getYoutubeEmbedUrl(): string {
    if (!this.product?.youtubeVideoUrl) return '';

    const value = this.product.youtubeVideoUrl.trim();
    const directMatch = value.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
    const fallbackMatch = value.match(/([A-Za-z0-9_-]{11})/);
    const match = directMatch ?? fallbackMatch;
    const videoId = match?.[1];

    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1` : '';
  }

  getSafeYoutubeEmbedUrl(): SafeResourceUrl {
    const url = this.getYoutubeEmbedUrl();
    return this.sanitizer.bypassSecurityTrustResourceUrl(url) as SafeResourceUrl;
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }

  openVideo() {
    this.videoOpen = !!this.getYoutubeEmbedUrl();
  }

  closeVideo() {
    this.videoOpen = false;
  }
}
