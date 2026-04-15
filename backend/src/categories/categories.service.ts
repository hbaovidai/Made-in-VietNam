import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          orderBy: { name: 'asc' },
          include: {
            _count: { select: { products: true } },
          },
        },
        _count: { select: { products: true, children: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        children: true,
        products: {
          where: { status: 'ACTIVE' },
          take: 20,
          include: {
            supplier: {
              select: { companyName: true, slug: true, isVerified: true },
            },
          },
        },
        _count: { select: { products: true } },
      },
    });

    if (!category) throw new NotFoundException('Danh mục không tồn tại');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        parentId: dto.parentId || null,
      },
    });
  }

  async update(id: string, dto: { name?: string; parentId?: string }) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) throw new NotFoundException('Danh mục không tồn tại');

    const data: any = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = dto.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
    if (dto.parentId !== undefined) data.parentId = dto.parentId || null;

    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!category) throw new NotFoundException('Danh mục không tồn tại');

    if (category._count.products > 0) {
      throw new NotFoundException(`Không thể xóa — danh mục đang chứa ${category._count.products} sản phẩm`);
    }
    if (category._count.children > 0) {
      throw new NotFoundException(`Không thể xóa — danh mục có ${category._count.children} danh mục con`);
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Đã xóa danh mục' };
  }
}
