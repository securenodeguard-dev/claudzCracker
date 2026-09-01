import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateProductDto } from './dto/create-product.dto';

describe('CreateProductDto', () => {
  it('accepts youtube and offer pricing metadata', async () => {
    const dto = plainToInstance(CreateProductDto, {
      name: 'Diwali Sparklers',
      categoryId: '507f1f77bcf86cd799439011',
      description: 'Offer pack',
      price: 499,
      originalPrice: 699,
      offerPrice: 499,
      priceMode: 'offer',
      youtubeVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      showPrice: true,
    });

    expect(dto).toHaveProperty('youtubeVideoUrl', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(dto).toHaveProperty('priceMode', 'offer');
    expect(dto).toHaveProperty('originalPrice', 699);
    expect(dto).toHaveProperty('offerPrice', 499);

    const errors = await validate(dto);
    expect(errors).toHaveLength(0);
  });
});
