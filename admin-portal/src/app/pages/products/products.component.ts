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
// (Cloudinary uploads return a full https:// URL already). A relative path
// needs to resolve against the API host, not wherever this Angular app is
// served from, so it can't be used as an <img src> directly.
const apiOrigin = environment.apiBaseUrl.replace(/\/api\/v1\/?$/, '');
function resolveImageUrl(url?: string | null): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `${apiOrigin}${url}`;
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

  archive(product: Product) {
    if (!confirm(`Archive "${product.name}"? It will no longer show on the consumer site.`)) return;
    this.productService.archive(product._id).subscribe({ next: () => this.load() });
  }

  categoryName(product: Product): string {
    return typeof product.categoryId === 'string' ? product.categoryId : product.categoryId.name;
  }

  resolveImageUrl(url?: string | null): string {
    return resolveImageUrl(url);
  }
}