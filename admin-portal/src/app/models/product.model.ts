export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: { _id: string; name: string } | string;
  description?: string;
  price?: number | null;
  showPrice: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  sortOrder: number;
  isActive: boolean;
}
