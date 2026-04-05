import { IsString, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddInquiryItemDto {
  @IsString() @IsNotEmpty() productId: string;
  @IsInt() @Min(1) @Type(() => Number) quantity: number;
  @IsString() @IsOptional() note?: string;
}
