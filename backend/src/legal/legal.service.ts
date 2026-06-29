import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLegalSectionDto, UpdateLegalSectionDto } from './legal.dto';

@Injectable()
export class LegalService {
  constructor(private prisma: PrismaService) {}

  /** Helper to seed initial terms or privacy sections if empty */
  private async checkAndSeed() {
    // Seed data logic is commented out to keep the service code clean.
    // Database seeding should be handled via Prisma Seed.
  }

  /** Public: Get active sections by pageKey sorted by sortOrder ASC */
  async findActive(pageKey: string = 'terms') {
    await this.checkAndSeed();
    return this.prisma.legalSection.findMany({
      where: { isActive: true, pageKey },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  /** Admin: Get all sections by pageKey sorted by sortOrder ASC */
  async findAll(pageKey: string = 'terms') {
    await this.checkAndSeed();
    return this.prisma.legalSection.findMany({
      where: { pageKey },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  /** Admin: Get single section */
  async findOne(id: string) {
    const section = await this.prisma.legalSection.findUnique({ where: { id } });
    if (!section) {
      throw new NotFoundException(`Legal section with ID ${id} not found`);
    }
    return section;
  }

  /** Admin: Create section */
  async create(dto: CreateLegalSectionDto) {
    const pageKey = dto.pageKey || 'terms';
    let sortOrder = dto.sortOrder;
    if (sortOrder === undefined || sortOrder === null) {
      const maxSection = await this.prisma.legalSection.findFirst({
        where: { pageKey },
        orderBy: { sortOrder: 'desc' },
      });
      sortOrder = maxSection ? maxSection.sortOrder + 1 : 0;
    }

    return this.prisma.legalSection.create({
      data: {
        pageKey,
        titleVi: dto.titleVi,
        titleEn: dto.titleEn,
        slug: dto.slug,
        contentVi: dto.contentVi,
        contentEn: dto.contentEn,
        sortOrder,
        isActive: dto.isActive ?? true,
      },
    });
  }

  /** Admin: Update section */
  async update(id: string, dto: UpdateLegalSectionDto) {
    await this.findOne(id);
    return this.prisma.legalSection.update({
      where: { id },
      data: {
        pageKey: dto.pageKey,
        titleVi: dto.titleVi,
        titleEn: dto.titleEn,
        slug: dto.slug,
        contentVi: dto.contentVi,
        contentEn: dto.contentEn,
        sortOrder: dto.sortOrder,
        isActive: dto.isActive,
      },
    });
  }

  /** Admin: Delete section */
  async delete(id: string) {
    await this.findOne(id);
    return this.prisma.legalSection.delete({ where: { id } });
  }

  /** Admin: Move up/down inside its specific pageKey group */
  async move(id: string, direction: 'up' | 'down') {
    const section = await this.findOne(id);
    const pageKey = section.pageKey;

    const all = await this.findAll(pageKey);
    const currentIndex = all.findIndex((item) => item.id === id);
    if (currentIndex === -1) {
      throw new NotFoundException(`Legal section with ID ${id} not found`);
    }

    let targetIndex = -1;
    if (direction === 'up') {
      targetIndex = currentIndex - 1;
    } else if (direction === 'down') {
      targetIndex = currentIndex + 1;
    }

    if (targetIndex >= 0 && targetIndex < all.length) {
      // Swap items
      const temp = all[currentIndex];
      all[currentIndex] = all[targetIndex];
      all[targetIndex] = temp;

      // Update all sortOrders sequentially in transaction
      const updates = all.map((item, index) =>
        this.prisma.legalSection.update({
          where: { id: item.id },
          data: { sortOrder: index },
        }),
      );
      await this.prisma.$transaction(updates);
    }

    return this.findAll(pageKey);
  }
}
