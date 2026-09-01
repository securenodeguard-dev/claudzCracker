import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { SiteSettings } from '../../models/site-settings.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {
  private api = inject(ApiService);
  settings: SiteSettings | null = null;

  ngOnInit() {
    this.api.getSiteSettings().subscribe({ next: (s) => (this.settings = s) });
  }
}
