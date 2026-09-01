import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { SettingsService } from '../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private settingsService = inject(SettingsService);

  loading = true;
  saving = false;
  saved = false;
  formError = '';

  form = this.fb.nonNullable.group({
    businessName: [''],
    tagline: [''],
    logoUrl: [''],
    phone: [''],
    whatsapp: [''],
    email: [''],
    address: [''],
    googleMapsUrl: [''],
    openingHours: [''],
    socialLinks: this.fb.nonNullable.group({
      facebook: [''],
      instagram: [''],
      youtube: [''],
    }),
  });

  ngOnInit() {
    this.settingsService.get().subscribe({
      next: (s) => {
        this.form.patchValue({
          businessName: s.businessName || '',
          tagline: s.tagline || '',
          logoUrl: s.logoUrl || '',
          phone: s.phone || '',
          whatsapp: s.whatsapp || '',
          email: s.email || '',
          address: s.address || '',
          googleMapsUrl: s.googleMapsUrl || '',
          openingHours: s.openingHours || '',
          socialLinks: {
            facebook: s.socialLinks?.facebook || '',
            instagram: s.socialLinks?.instagram || '',
            youtube: s.socialLinks?.youtube || '',
          },
        });
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  submit() {
    this.saving = true;
    this.saved = false;
    this.formError = '';
    this.settingsService.update(this.form.getRawValue()).subscribe({
      next: () => {
        this.saving = false;
        this.saved = true;
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }
}
