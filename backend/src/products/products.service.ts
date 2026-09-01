import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import slugify from 'slugify';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private categoriesService: CategoriesService,
  ) {}

  private async uniqueSlug(name: string, excludeId?: string): Promise<string> {
    const base = slugify(name, { lower: true, strict: true });
    let slug = base;
    let counter = 1;
    while (
      await this.productModel.findOne({ slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) })
    ) {
      slug = `${base}-${counter++}`;
    }
    return slug;
  }

  async create(dto: CreateProductDto) {
    await this.categoriesService.assertExistsAndActive(dto.categoryId);
    const slug = await this.uniqueSlug(dto.name);
    return this.productModel.create({ ...dto, slug });
  }

  async findAllForAdmin() {
    return this.productModel.find().populate('categoryId').sort({ sortOrder: 1, name: 1 });
  }

  async findOneByIdForAdmin(id: string) {
    const product = await this.productModel.findById(id).populate('categoryId');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Public listing exposes only active products, and (implicitly, via the
  // categories collection) only products under active categories.
  async findActiveForPublic(query: QueryProductsDto) {
    const filter: Record<string, any> = { isActive: true };

    if (query.category) {
      const category = await this.categoriesService.findOneBySlugPublic(query.category);
      filter.categoryId = category._id;
    }

    if (query.q) {
      filter.$or = [
        { name: { $regex: query.q, $options: 'i' } },
        { description: { $regex: query.q, $options: 'i' } },
      ];
    }

    return this.productModel
      .find(filter)
      .populate({ path: 'categoryId', match: { isActive: true } })
      .sort({ sortOrder: 1, name: 1 })
      .then((products) => products.filter((p) => p.categoryId)); // drop products whose category got deactivated
  }

  async findOneBySlugPublic(slug: string) {
    const product = await this.productModel
      .findOne({ slug, isActive: true })
      .populate({ path: 'categoryId', match: { isActive: true } });
    if (!product || !product.categoryId) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findOneByIdForAdmin(id);
    if (dto.categoryId) {
      await this.categoriesService.assertExistsAndActive(dto.categoryId);
    }
    if (dto.name && dto.name !== product.name) {
      (product as any).slug = await this.uniqueSlug(dto.name, id);
    }
    Object.assign(product, dto);
    return product.save();
  }

  async setImage(id: string, imageUrl: string, imagePublicId: string) {
    const product = await this.findOneByIdForAdmin(id);
    product.imageUrl = imageUrl;
    product.imagePublicId = imagePublicId;
    return product.save();
  }

  async archive(id: string) {
    const product = await this.findOneByIdForAdmin(id);
    product.isActive = false;
    await product.save();
    return { archived: true };
  }
}
