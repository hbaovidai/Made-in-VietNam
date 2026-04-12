import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async getReports() {
    return this.prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async getReportById(id: string) {
    return this.prisma.report.findUnique({
      where: { id },
    });
  }
}
