import { ProductStatus } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description?: string;
    minPrice: number;
    maxPrice: number;
    currency?: string;
    unit: string;
    moq: number;
    moqUnit: string;
    categoryId: string;
    images?: string[];
}
export declare class UpdateProductDto {
    name?: string;
    description?: string;
    minPrice?: number;
    maxPrice?: number;
    unit?: string;
    moq?: number;
    moqUnit?: string;
    categoryId?: string;
    images?: string[];
    status?: ProductStatus;
}
export declare class ProductQueryDto {
    search?: string;
    category?: string;
    supplierId?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
