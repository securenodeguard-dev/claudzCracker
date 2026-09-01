export interface Product {
  _id: string;
  name: string;
  slug: string;
  categoryId: { _id: string; name: string } | string;
  description?: string;
  price?: number | null;
  originalPrice?: number | null;
  offerPrice?: number | null;
  priceMode?: 'regular' | 'offer';
  youtubeVideoUrl?: string | null;
  showPrice: boolean;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  sortOrder: number;
  isActive: boolean;
}
