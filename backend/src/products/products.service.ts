import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: ProductQueryDto) {
    const { search, category, supplierId, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const where: Prisma.ProductWhereInput = {
      status: 'ACTIVE',
    };

    // Search by name
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Filter by category slug
    if (category) {
      where.category = { slug: category };
    }

    // Filter by supplier
    if (supplierId) {
      where.supplierId = supplierId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          supplier: { select: { id: true, companyName: true, slug: true, isVerified: true, logo: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        supplier: {
          select: {
            id: true,
            companyName: true,
            slug: true,
            isVerified: true,
            logo: true,
            description: true,
            city: true,
            province: true,
            industries: { select: { industry: true } },
            markets: { select: { market: true } },
          },
        },
      },
    });

    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    // Increment view count
    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  async create(supplierId: string, dto: CreateProductDto) {
    const slug = dto.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      + '-' + Date.now();

    return this.prisma.product.create({
      data: {
        supplierId,
        name: dto.name,
        slug,
        description: dto.description,
        minPrice: dto.minPrice,
        maxPrice: dto.maxPrice,
        currency: dto.currency || 'VND',
        unit: dto.unit,
        moq: dto.moq,
        moqUnit: dto.moqUnit,
        categoryId: dto.categoryId,
        images: dto.images || [],
      },
      include: {
        category: { select: { name: true, slug: true } },
      },
    });
  }

  async update(productId: string, supplierId: string, dto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    if (product.supplierId !== supplierId) throw new ForbiddenException('Không có quyền chỉnh sửa');

    return this.prisma.product.update({
      where: { id: productId },
      data: dto,
      include: {
        category: { select: { name: true, slug: true } },
      },
    });
  }

  async delete(productId: string, supplierId: string) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    if (product.supplierId !== supplierId) throw new ForbiddenException('Không có quyền xóa');

    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Đã xóa sản phẩm' };
  }

  // Sản phẩm liên quan (cùng category)
  async findRelated(productId: string, limit: number = 6) {
    const product = await this.prisma.product.findUnique({ where: { id: productId } });
    if (!product) return [];

    return this.prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
        status: 'ACTIVE',
      },
      include: {
        supplier: { select: { companyName: true, slug: true } },
      },
      take: limit,
    });
  }
}
