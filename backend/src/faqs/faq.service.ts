import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FaqService {
  constructor(private prisma: PrismaService) {}

  /** Public: Get active FAQs sorted by sort_order ASC, id ASC */
  async findActive() {
    return this.prisma.faq.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  /** Admin: Get all FAQs */
  async findAll() {
    return this.prisma.faq.findMany({
      orderBy: [{ sortOrder: 'asc' }, { id: 'asc' }],
    });
  }

  /** Admin: Create FAQ */
  async create(data: {
    questionVi: string;
    answerVi: string;
    questionEn: string;
    answerEn: string;
    sortOrder?: number;
    isActive?: boolean;
  }) {
    return this.prisma.faq.create({ data });
  }

  /** Admin: Update FAQ */
  async update(
    id: string,
    data: {
      questionVi?: string;
      answerVi?: string;
      questionEn?: string;
      answerEn?: string;
      sortOrder?: number;
      isActive?: boolean;
    },
  ) {
    return this.prisma.faq.update({ where: { id }, data });
  }

  /** Admin: Delete FAQ */
  async delete(id: string) {
    return this.prisma.faq.delete({ where: { id } });
  }
}
