import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class SuppliersService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: SupplierQueryDto) {
    const { search, industry, page = 1, limit = 20 } = query;

    const where: Prisma.SupplierWhereInput = {};

    if (search) {
      where.companyName = { contains: search, mode: 'insensitive' };
    }

    if (industry) {
      where.industries = { some: { industry } };
    }

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        include: {
          industries: { select: { industry: true } },
          markets: { select: { market: true } },
          certifications: { select: { name: true } },
          _count: { select: { products: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { slug },
      include: {
        user: { select: { fullName: true, email: true } },
        industries: { select: { industry: true } },
        markets: { select: { market: true } },
        certifications: true,
        products: {
          where: { status: 'ACTIVE' },
          take: 8,
          include: {
            category: { select: { name: true, slug: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
        _count: { select: { products: true } },
      },
    });

    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    return supplier;
  }

  async update(supplierId: string, dto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');

    const { industries, markets, ...data } = dto;

    // Update supplier basic info
    const updated = await this.prisma.supplier.update({
      where: { id: supplierId },
      data,
    });

    // Update industries if provided
    if (industries) {
      await this.prisma.supplierIndustry.deleteMany({ where: { supplierId } });
      await this.prisma.supplierIndustry.createMany({
        data: industries.map((industry) => ({ supplierId, industry })),
      });
    }

    // Update markets if provided
    if (markets) {
      await this.prisma.supplierMarket.deleteMany({ where: { supplierId } });
      await this.prisma.supplierMarket.createMany({
        data: markets.map((market) => ({ supplierId, market })),
      });
    }

    return this.findBySlug(updated.slug);
  }

  async addCertification(supplierId: string, data: { name: string; issuedBy?: string; documentUrl?: string }) {
    return this.prisma.certification.create({
      data: { supplierId, ...data },
    });
  }

  async deleteCertification(certId: string, supplierId: string) {
    const cert = await this.prisma.certification.findUnique({ where: { id: certId } });
    if (!cert || cert.supplierId !== supplierId) throw new NotFoundException('Chứng nhận không tồn tại');
    await this.prisma.certification.delete({ where: { id: certId } });
    return { message: 'Đã xóa chứng nhận' };
  }
}
