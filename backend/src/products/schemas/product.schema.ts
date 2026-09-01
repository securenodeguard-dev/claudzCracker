import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true, collection: 'products' })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true, index: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ trim: true, default: '' })
  description: string;

  @Prop({ type: Number, default: null })
  price: number | null;

  @Prop({ required: true, default: false })
  showPrice: boolean;

  @Prop({ type: String, default: null })
  imageUrl: string | null;

  @Prop({ type: String, default: null })
  imagePublicId: string | null;

  @Prop({ required: true, default: 0 })
  sortOrder: number;

  @Prop({ required: true, default: true })
  isActive: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
ProductSchema.index({ categoryId: 1, isActive: 1, sortOrder: 1 });
