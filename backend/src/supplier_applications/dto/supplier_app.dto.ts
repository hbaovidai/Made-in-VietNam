import { SupplierAccountHolderRole } from "@prisma/client";
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class SupplierApplicationDto {
  @IsOptional() @IsNumber() id?: string;
  @IsOptional() @IsString() accountHolderFullName?: string;
  @IsOptional() @IsString() accountHolderPhone?: string;
  @IsOptional() @IsEnum(SupplierAccountHolderRole) accountHolderRole?: SupplierAccountHolderRole;
  @IsOptional() @IsString() accountHolderGovId?: string;
  @IsOptional() @IsArray() accountHolderGovIdUrl?: string[];
  @IsOptional() @IsNumber() page?: number;
  @IsOptional() @IsNumber() limit?: number;
}
