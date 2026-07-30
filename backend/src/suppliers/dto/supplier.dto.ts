import { IsOptional, IsString, IsInt, IsArray, Min, IsEnum, IsObject, ValidateNested, IsBoolean, IsIn, isArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { BusinessType, Prisma, SupplierAccountHolderRole, SupplierStatus, SupplierType } from '@prisma/client';

type SupplierNonRelField = Prisma.SupplierScalarFieldEnum;
type SupplierRelField = keyof Prisma.SupplierInclude;

const ALLOWED_NON_REL_FIELDS_SUPPLIER: SupplierNonRelField[] = [ 
  // no relation fields
  'id', 'status', 'businessLicenseUrl', 'banner',
  'logo', 'companyName', 'contactEmail', 'contactPhone',
  'description', 'taxCode', 'yearEstablished', 'employee_count',
  'businessType', 'businessLicenseUrl', 'authorizationLetterUrl',
  'supplierType', 'website', 'legalRepName', 'legalRepGovId', 'legalRepGovIdUrl',
]

const ALLOW_REL_FIELDS_SUPPLIER: SupplierRelField[] = [
  // relations
  'user', 'categories', 'channels',
  'addresses', 'products', 'documents',

  'manufacturerProfile', 'exporterProfile',

  'industries', 'markets', 'batches', 'orders',
];

class BaseFindManyDto {
  @IsOptional() @Type(() => Number) @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @Min(1) limit?: number = 20;
}

export class SupplierFindOneDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsIn(ALLOWED_NON_REL_FIELDS_SUPPLIER, { each: true })
  fields?: SupplierNonRelField[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsIn(ALLOW_REL_FIELDS_SUPPLIER, { each: true })
  include?: SupplierRelField[];

  @IsOptional() @IsBoolean() findPrimaryAddress?: boolean = true;
  @IsOptional() @IsBoolean() status?: SupplierStatus;
}

export class SupplierFindManyDto extends BaseFindManyDto {
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsIn(ALLOWED_NON_REL_FIELDS_SUPPLIER, { each: true })
  fields?: SupplierNonRelField[];

  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.split(',') : value))
  @IsArray()
  @IsIn(ALLOW_REL_FIELDS_SUPPLIER, { each: true })
  include?: SupplierRelField[];

  @IsOptional() @IsBoolean() findPrimaryAddress?: boolean = true;
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() categorySlug?: string;
  @IsOptional() @IsEnum(SupplierStatus) status?: SupplierStatus;
}

export class UpdateSupplierDto {
  @IsString() @IsOptional() companyName?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() logo?: string;
  @IsString() @IsOptional() banner?: string;
  @IsEnum(BusinessType) @IsOptional() businessType?: BusinessType;
  @IsInt() @IsOptional() @Type(() => Number) yearEstablished?: number;
  @IsString() @IsOptional() employee_count?: string;
  @IsString() @IsOptional() primaryLocation?: string;
  @IsString() @IsOptional() website?: string;
  @IsString() @IsOptional() taxCode?: string;
  @IsString() @IsOptional() companyEmail?: string;
  @IsString() @IsOptional() companyPhone?: string;
  @IsString() @IsOptional() legalRepName?: string;
  @IsString() @IsOptional() legalRepPhone?: string;
  @IsString({ each: true }) @IsOptional() businessLicenseUrl?: string[];
  @IsString() @IsOptional() identityCardUrl?: string;
  @IsEnum(SupplierStatus) @IsOptional() status?: SupplierStatus;

  // industries will be phased out in favor of categories
  @IsArray() @IsString({ each: true }) @IsOptional() industries?: string[];
  @ValidateNested({ each: true })
  @Type(() => CategoryOption) categoryOptions: CategoryOption[];

  @IsArray() @IsString({ each: true }) @IsOptional() markets?: string[];
}

export class SupplierQueryDto {
  @IsOptional() @IsString() search?: string;
  @IsOptional() @IsString() industry?: string;
  @IsOptional() @IsString() categorySlug?: string;
  @IsOptional() @Type(() => Number) @Min(1) page?: number = 1;
  @IsOptional() @Type(() => Number) @Min(1) limit?: number = 20;
  @IsOptional() @IsEnum(BusinessType) businessType?: BusinessType;
  @IsOptional() @IsEnum(SupplierStatus) status?: SupplierStatus;
}

export class AdminQueryDto {
  @IsOptional() @IsString() slugOrId?: string;
  @IsOptional() @IsEnum(SupplierStatus) status?: SupplierStatus;
  // this looks cursed, but it's just a set of attributes copied over from the database. literally
  @IsOptional() @ValidateNested() @Type(() => UpdateSupplierDto) include?: UpdateSupplierDto;
}

export class CategoryOption {
  @IsString() id: string;
  @IsString() slug: string;
  @IsString() name: string;
  @IsBoolean() included: boolean;
}

export class CreateFakeSuppDto {
  // legal info
  @IsString() companyName: string;
  @IsString() taxCode: string;
  @IsString() primaryLocation: string;
  @IsEnum(BusinessType) businessType: BusinessType;

  // contact info
  @IsString() contactPhone: string;
  @IsString() contactEmail: string;
  @IsEnum(SupplierAccountHolderRole) accountHolderRole: SupplierAccountHolderRole;

  // other info
  @IsEnum(SupplierType) supplierType: SupplierType;
  @ValidateNested({ each: true })
  @Type(() => CategoryOption) categoryOptions: CategoryOption[];

  // sale channels
  @IsOptional() @IsString() website?: string;
  @IsOptional() @IsString() facebook?: string;
  @IsOptional() @IsString() instagram?: string;
  @IsOptional() @IsString() shopee?: string;

  // images
  @IsString() logo: string;
  @IsString() banner: string;
}
