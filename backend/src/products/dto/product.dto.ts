import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ProductStatus, PricingMode } from '@prisma/client';

class PricingTierDto {
  @IsNumber() @IsNotEmpty() @Type(() => Number) minQty: number;
  @IsOptional() @IsNumber() @Type(() => Number) maxQty?: number;
  @IsNumber() @IsNotEmpty() @Type(() => Number) price: number;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minPrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  maxPrice: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsNotEmpty()
  unit: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  moq: number;

  @IsString()
  @IsNotEmpty()
  moqUnit: string;

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rfqMinQuantity?: number;

  @IsOptional()
  @IsEnum(PricingMode)
  pricingMode?: PricingMode;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingTierDto)
  priceTiers?: PricingTierDto[];

  @IsOptional()
  @IsArray()
  specifications?: {name?: string; url?: string}[];
}

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  minPrice?: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  maxPrice?: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  moq?: number;

  @IsString()
  @IsOptional()
  moqUnit?: string;

  @IsString()
  @IsOptional()
  categoryId?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rfqMinQuantity?: number;

  @IsOptional()
  @IsEnum(PricingMode)
  pricingMode?: PricingMode;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PricingTierDto)
  priceTiers?: PricingTierDto[];

  @IsOptional()
  @IsArray()
  specifications?: {name?: string; url?: string}[];
}

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  supplierId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 70;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;
}
