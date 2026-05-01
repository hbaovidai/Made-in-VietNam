import {
  IsString,
  IsInt,
  IsOptional,
  IsEnum,
  Min,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RFQStatus, QuoteStatus } from '@prisma/client';

export class CreateRFQDto {
  @IsString() productName: string;
  @IsString() category: string;
  @IsInt() @Min(1) @Type(() => Number) quantity: number;
  @IsString() quantityUnit: string;
  @IsString() description: string;
  @IsString() @IsOptional() budget?: string;
  @IsString() destination: string;
  @IsString() @IsOptional() contactName?: string;
  @IsString() @IsOptional() contactEmail?: string;
  @IsString() @IsOptional() contactPhone?: string;
  @IsString() expiresAt: string; // ISO date string
}

export class CreateQuoteDto {
  @IsString() rfqId: string;
  @IsPositive() @Type(() => Number) price: number;
  @IsString() @IsOptional() currency?: string = 'VND';
  @IsString() leadTime: string;
  @IsString() @IsOptional() message?: string;
}

export class UpdateRFQStatusDto {
  @IsEnum(RFQStatus) status: RFQStatus;
}

export class UpdateQuoteStatusDto {
  @IsEnum(QuoteStatus) status: QuoteStatus;
}
