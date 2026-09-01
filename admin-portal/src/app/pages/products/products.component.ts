import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { UploadService } from '../../services/upload.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { environment } from '../../../environments/environment';

// Local-disk fallback uploads return a relative path like "/uploads/x.jpg"
// while production deployments may serve the API and app from the same origin.
// Resolve relative asset paths against the configured API origin, then fall back
// to the browser origin so the site works in both local and production hosting.
const apiOrigin = environment?.apiBaseUrl ? environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '') : window.location.origin;
function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('//')) return `https:${url}`;
  const normalized = url.startsWith('/') ? url : `/${url}`;
  return `${apiOrigin}${normalized}`;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private uploadService = inject(UploadService);

  products: Product[] = [];
  categories: Category[] = [];
  loading = true;
  saving = false;
  uploading = false;
  editingId: string | null = null;
  formError = '';
  imagePreviewUrl: string | null = null;
  pendingImage: { url: string; publicId: string } | null = null;

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    categoryId: ['', Validators.required],
    description: [''],
    price: [null as number | null],
    originalPrice: [null as number | null],
    offerPrice: [null as number | null],
    priceMode: ['regular' as 'regular' | 'offer'],
    youtubeVideoUrl: [''],
    showPrice: [true],
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit() {
    this.categoryService.list().subscribe({ next: (c) => (this.categories = c.filter((cat) => cat.isActive)) });
    this.load();
  }

  load() {
    this.loading = true;
    this.productService.list().subscribe({
      next: (p) => {
        this.products = p;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.formError = '';
    this.uploadService.uploadImage(file).subscribe({
      next: (res) => {
        this.pendingImage = res;
        this.imagePreviewUrl = resolveImageUrl(res.url);
        this.uploading = false;
      },
      error: (err) => {
        this.uploading = false;
        this.formError = err?.error?.message || 'Image upload failed.';
      },
    });
  }

  edit(product: Product) {
    this.editingId = product._id;
    const categoryId = typeof product.categoryId === 'string' ? product.categoryId : product.categoryId._id;
    this.form.setValue({
      name: product.name,
      categoryId,
      description: product.description || '',
      price: product.price ?? null,
      originalPrice: product.originalPrice ?? null,
      offerPrice: product.offerPrice ?? null,
      priceMode: product.priceMode ?? 'regular',
      youtubeVideoUrl: product.youtubeVideoUrl ?? '',
      showPrice: product.showPrice,
      sortOrder: product.sortOrder,
      isActive: product.isActive,
    });
    this.imagePreviewUrl = resolveImageUrl(product.imageUrl) || null;
    this.pendingImage = null;
  }

  cancelEdit() {
    this.editingId = null;
    this.imagePreviewUrl = null;
    this.pendingImage = null;
    this.form.reset({
      name: '',
      categoryId: '',
      description: '',
      price: null,
      originalPrice: null,
      offerPrice: null,
      priceMode: 'regular',
      youtubeVideoUrl: '',
      showPrice: true,
      sortOrder: 0,
      isActive: true,
    });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.formError = '';
    const value: any = { ...this.form.getRawValue() };
    if (this.pendingImage) {
      value.imageUrl = this.pendingImage.url;
      value.imagePublicId = this.pendingImage.publicId;
    }

    const request = this.editingId
      ? this.productService.update(this.editingId, value)
      : this.productService.create(value);

    request.subscribe({
      next: () => {
        this.saving = false;
        this.cancelEdit();
        this.load();
      },
      error: (err) => {
        this.saving = false;
        this.formError = err?.error?.message || 'Something went wrong. Please try again.';
      },
    });
  }

  deleteProduct(product: Product) {
    if (!confirm(`Delete "${product.name}" permanently? This removes it from the database and storage.`)) return;
    this.productService.delete(product._id).subscribe({ next: () => this.load() });
  }

  categoryName(product: Product): string {
    return typeof product.categoryId === 'string' ? product.categoryId : product.categoryId.name;
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }
}