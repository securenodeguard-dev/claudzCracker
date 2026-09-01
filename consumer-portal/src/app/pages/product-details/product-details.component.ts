import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { Product } from '../../models/product.model';
import { SiteSettings } from '../../models/site-settings.model';

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

  product: Product | null = null;
  settings: SiteSettings | null = null;
  loading = true;
  notFound = false;

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
}
