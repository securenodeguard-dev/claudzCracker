import { Category } from './category.model';

export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: Category | string;
  description?: string;
  price?: number | null;
  originalPrice?: number | null;
  offerPrice?: number | null;
  priceMode?: 'regular' | 'offer';
  youtubeVideoUrl?: string | null;
  showPrice: boolean;
  imageUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
}
