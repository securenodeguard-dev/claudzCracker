import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models/category.model';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
})
export class CategoriesComponent implements OnInit {
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  categories: Category[] = [];
  loading = true;
  saving = false;
  editingId: string | null = null;
  formError = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    sortOrder: [0],
    isActive: [true],
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.categoryService.list().subscribe({
      next: (c) => {
        this.categories = c;
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  edit(category: Category) {
    this.editingId = category._id;
    this.form.setValue({
      name: category.name,
      description: category.description || '',
      sortOrder: category.sortOrder,
      isActive: category.isActive,
    });
  }

  cancelEdit() {
    this.editingId = null;
    this.form.reset({ name: '', description: '', sortOrder: 0, isActive: true });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.saving = true;
    this.formError = '';
    const value = this.form.getRawValue();

    const request = this.editingId
      ? this.categoryService.update(this.editingId, value)
      : this.categoryService.create(value);

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

  toggleActive(category: Category) {
    this.categoryService.update(category._id, { isActive: !category.isActive }).subscribe({
      next: () => this.load(),
    });
  }
}
