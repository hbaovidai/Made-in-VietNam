import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    fullName: string;
    email: string;
    subject: string;
    message: string;
  }) {
    return this.prisma.contactSubmission.create({ data });
  }

  async findAll() {
    return this.prisma.contactSubmission.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string, isRead: boolean) {
    return this.prisma.contactSubmission.update({
      where: { id },
      data: { isRead },
    });
  }

  async delete(id: string) {
    return this.prisma.contactSubmission.delete({
      where: { id },
    });
  }
}
