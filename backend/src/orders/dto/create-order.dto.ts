import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Min, ValidateNested } from 'class-validator';

export class OrderItemDto {
  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsOptional()
  @IsString()
  productId?: string;

  @ApiProperty({ example: 'Diwali Sparklers' })
  @IsString()
  @IsNotEmpty()
  productName: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 399 })
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @ApiProperty({ example: 798 })
  @IsNumber()
  @Min(0)
  total: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'Ramesh K' })
  @IsString()
  @IsNotEmpty()
  customerName: string;

  @ApiProperty({ example: '9876543210' })
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiPropertyOptional({ example: '9876543210' })
  @IsOptional()
  @IsString()
  whatsappNumber?: string;

  @ApiPropertyOptional({ example: '12 Main Road, Madurai' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Google Search' })
  @IsOptional()
  @IsString()
  source?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
