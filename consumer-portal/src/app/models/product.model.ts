import { Category } from './category.model';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category | string;
  description?: string;
  price?: number | null;
  showPrice: boolean;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}
