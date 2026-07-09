import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/category.dto';
import { TranslationService } from '../translation/translation.service';
import { Category } from '@prisma/client';

type CategoryNode = Category & {
  children: CategoryNode[];
};
@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private translationService: TranslationService,
  ) {}

  private buildTree(categories: Category[]) {
    const map = new Map<string, CategoryNode>();

    categories.forEach((category) => {
      map.set(category.id, {
        ...category,
        children: [] as CategoryNode[],
      });
    });

    const roots: CategoryNode[] = [];

    categories.forEach((category) => {
      const node: CategoryNode = map.get(category.id)!;

      if (!category.parentId) {
        roots.push(node);
      } else {
        const parent: CategoryNode = map.get(category.parentId)!;

        if (parent) {
          parent.children.push(node);
        }
      }
    });

    return roots;
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return this.buildTree(categories);
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
              select: { companyName: true, slug: true, status: true, },
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

    const category = await this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
        parentId: dto.parentId || null,
      },
    });

    // Auto-translate category name (non-blocking)
    this.translationService
      .translateCategory(dto.name)
      .then(async (nameEn) => {
        if (nameEn) {
          await this.prisma.category.update({
            where: { id: category.id },
            data: { nameEn },
          });
        }
      })
      .catch((err) => console.error('Auto-translate category failed:', err));

    return category;
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

    const updated = await this.prisma.category.update({ where: { id }, data });

    // Re-translate if name changed (non-blocking)
    if (dto.name) {
      this.translationService
        .translateCategory(dto.name)
        .then(async (nameEn) => {
          if (nameEn) {
            await this.prisma.category.update({
              where: { id },
              data: { nameEn },
            });
          }
        })
        .catch((err) =>
          console.error('Auto-translate category update failed:', err),
        );
    }

    return updated;
  }

  async delete(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true, children: true } } },
    });
    if (!category) throw new NotFoundException('Danh mục không tồn tại');

    if (category._count.products > 0) {
      throw new NotFoundException(
        `Không thể xóa — danh mục đang chứa ${category._count.products} sản phẩm`,
      );
    }
    if (category._count.children > 0) {
      throw new NotFoundException(
        `Không thể xóa — danh mục có ${category._count.children} danh mục con`,
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Đã xóa danh mục' };
  }
}
