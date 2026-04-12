import {
  IsString,
  IsNotEmpty,
  IsInt,
  Min,
  IsDateString,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsString() @IsNotEmpty() batchNumber: string;
  @IsDateString() manufactureDate: string;
  @IsDateString() expiryDate: string;
  @IsInt() @Min(1) @Type(() => Number) quantity: number;
}

export class GenerateQRCodesDto {
  @IsString() @IsNotEmpty() batchId: string;
  @IsInt() @Min(1) @Type(() => Number) count: number;
}

export class VerifyQRDto {
  @IsString() @IsNotEmpty() code: string;
  @IsString() @IsOptional() token?: string; // HMAC token — optional for manual entry
  @IsString() @IsOptional() ipUrl?: string; // Tạm dùng body để truyền IP thay vì req.ip cho DTO
}
