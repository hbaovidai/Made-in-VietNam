import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSupplierDto, SupplierQueryDto, AdminQueryDto, CreateFakeSuppDto, CategoryOption } from './dto/supplier.dto';
import { Prisma, Role, SaleChannelType, SupplierMediaType, SupplierStatus } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';

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

    if (query.categorySlug) where.categories = { some: { categorySlug: query.categorySlug } };

    if (query.status) where.status = query.status;

    const [suppliers, total] = await Promise.all([
      this.prisma.supplier.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          categories: true,
          channels: true,
          industries: { select: { industry: true } },
          // conjecture: primary addresses are used the most
          addresses: { 
            where: { isPrimary: true },
            select: { supplierSlug: true, address: true, isPrimary: true },
          },
        },
      }),
      this.prisma.supplier.count({ where }),
    ]);

    return {
      data: suppliers,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  // this one is for the public, we should limit the information we're giving them
  // why is the repo open to the public btw?
  async findBySlug(slugOrId: string) {
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        slugOrId,
      );

    const supplier = await this.prisma.supplier.findFirst({
      where: {
        status: SupplierStatus.VERIFIED,
        ...(isUUID ? { id: slugOrId } : { slug: slugOrId }),
      },

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
        categories: true, channels: true,
        addresses: { 
          where: { isPrimary: true },
          select: {isPrimary: true, address: true}
        },
        _count: { select: { products: true } },
      },
    });

    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    return supplier;
  }

  async findBySlugAdmin(slugOrId: string) {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slugOrId);

    const supplier = await this.prisma.supplier.findUnique({
      where: { ...(isUUID ? { id: slugOrId } : { slug: slugOrId }),},
      include: {
        categories: true,
        addresses: {
          where: {isPrimary: true },
          select: {address: true, isPrimary: true} },
          channels: true
      }
    });

    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');
    return supplier;
  }

  // note: idk what this for, we can create supplier profiles in the auth module
  async createProfile(userId: string, data: any) {
    const existing = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (existing) {
      return existing; // already exists
    }

    const slug = data.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const supplier = await this.prisma.supplier.create({
      data: {
        userId,
        companyName: data.companyName,
        businessType: data.businessType,
        description: data.description,
        taxCode: data.taxCode,
        legalRepName: data.legalRepName,
        contactPhone: data.contactPhone,
        slug: `${slug}-${Date.now()}`,
        accountHolderRole: data.accountHolderRole,
      },
    });
    return supplier;
  }

  async createFakeProfile(dto: CreateFakeSuppDto) {
    console.log(dto);

    try {
      const existingUser = await this.prisma.user.findFirst({
        where: { email: dto.contactEmail },
        select: { email: true }
      });
      if (existingUser) return { success: false, message: 'Email đã được sử dụng' };

      const existingCompany = await this.prisma.supplier.findFirst({
        where: { taxCode: dto.taxCode },
        select: { id: true }
      });
      if (existingCompany) return { success: false, message: 'Doanh nghiệp đã tồn tại.' };

      const passwordHash = await bcrypt.hash(uuidv4(), 10);
      const slug = dto.companyName
      .toLowerCase()
      .replace(/[^A-Za-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

      const {
        website, facebook, shopee, instagram,
        categoryOptions, primaryLocation,
        ...supplierData
      } = dto;

      await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: dto.contactEmail,
            phone: dto.contactPhone,
            passwordHash: passwordHash,
            role: Role.SUPPLIER,
            fullName: dto.companyName,
          },
        });

        const supplierProfile = await tx.supplier.create({
          data: {
            userId: user.id,
            slug: `${slug}-${dto.taxCode}`,
            ...supplierData,
            isFake: true
          },
        });

        if (website) await tx.supplierChannelMap.create({
          data: {
            supplierSlug: supplierProfile.slug, url: website, type: SaleChannelType.CUSTOM_WEBSITE
          }
        })

        if (facebook) await tx.supplierChannelMap.create({
          data: {
            supplierSlug: supplierProfile.slug, url: facebook, type: SaleChannelType.FACEBOOK
          }
        })

        if (shopee) await tx.supplierChannelMap.create({
          data: {
            supplierSlug: supplierProfile.slug, url: shopee, type: SaleChannelType.SHOPEE
          }
        })

        if (instagram) await tx.supplierChannelMap.create({
          data: {
            supplierSlug: supplierProfile.slug, url: instagram, type: SaleChannelType.INSTAGRAM
          }
        })

        await tx.supplierCategoryMap.createMany({
          data: categoryOptions.map((opt: CategoryOption) => {
            return { supplierSlug: supplierProfile.slug, categorySlug: opt.slug, categoryLevel: 1, }
          })
        })

        await tx.supplierAddressMap.create({
          data: {
            supplierSlug: supplierProfile.slug, address: primaryLocation, isPrimary: true
          }
        })
      });

      return {
        message: 'Đã tạo hồ sơ nhà cung cấp',
        success: true,
      };

    } catch (error) {
      console.error('Error creating fake profile:', error);
      return { 
        message: error.message || 'Đã xảy ra lỗi hệ thống.', 
        success: false 
      };
    }
  }

  async update(supplierId: string, dto: UpdateSupplierDto) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
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

  async addCertification(
    supplierId: string,
    data: { name: string; issuedBy?: string; documentUrl?: string },
  ) {
    return this.prisma.certification.create({
      data: { supplierId, ...data },
    });
  }

  async deleteCertification(certId: string, supplierId: string) {
    const cert = await this.prisma.certification.findUnique({
      where: { id: certId },
    });
    if (!cert || cert.supplierId !== supplierId)
      throw new NotFoundException('Chứng nhận không tồn tại');
    await this.prisma.certification.delete({ where: { id: certId } });
    return { message: 'Đã xóa chứng nhận' };
  }

  async verifySupplier(supplierId: string, isVerified: boolean) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { id: supplierId },
    });
    if (!supplier) throw new NotFoundException('Nhà cung cấp không tồn tại');

    // Update verified status
    const updated = await this.prisma.supplier.update({
      where: { id: supplierId },
      data: { 
        status: isVerified ? SupplierStatus.VERIFIED : SupplierStatus.APPLICATION_PENDING
      }
    });

    return updated;
  }

  async getStats(supplierId: string) {
    const [productCount, batchCount, qrCount, totalViews] = await Promise.all([
      this.prisma.product.count({ where: { supplierId, status: 'ACTIVE' } }),
      this.prisma.batch.count({ where: { supplierId } }),
      this.prisma.qRCode.count({ where: { batch: { supplierId } } }),
      this.prisma.product.aggregate({
        where: { supplierId },
        _sum: { viewCount: true },
      }),
    ]);

    return {
      products: productCount,
      batches: batchCount,
      qrCodes: qrCount,
      totalViews: totalViews._sum.viewCount || 0,
    };
  }

  async getAnalytics(supplierId: string) {
    // Lấy danh sách productIds thuộc supplier
    const products = await this.prisma.product.findMany({
      where: { supplierId },
      select: { id: true, name: true, viewCount: true, status: true },
    });
    const productIds = products.map((p) => p.id);

    // 1) Lượt xem theo ngày (30 ngày gần nhất)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyViews = await this.prisma.viewHistory.groupBy({
      by: ['viewedAt'],
      where: {
        productId: { in: productIds },
        viewedAt: { gte: thirtyDaysAgo },
      },
      _count: { id: true },
    });

    // Gom theo ngày (YYYY-MM-DD)
    const dailyMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap[d.toISOString().slice(0, 10)] = 0;
    }
    for (const row of dailyViews) {
      const key = new Date(row.viewedAt).toISOString().slice(0, 10);
      if (dailyMap[key] !== undefined) {
        dailyMap[key] += row._count.id;
      }
    }

    const dailyData = Object.entries(dailyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({ date, views }));

    // 2) Lượt xem theo tháng (12 tháng)
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const monthlyViews = await this.prisma.viewHistory.groupBy({
      by: ['viewedAt'],
      where: {
        productId: { in: productIds },
        viewedAt: { gte: twelveMonthsAgo },
      },
      _count: { id: true },
    });

    const monthlyMap: Record<string, number> = {};
    for (let i = 11; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      monthlyMap[
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      ] = 0;
    }
    for (const row of monthlyViews) {
      const d = new Date(row.viewedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap[key] !== undefined) {
        monthlyMap[key] += row._count.id;
      }
    }

    const monthlyData = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, views]) => ({ month, views }));

    // 3) Hiệu suất sản phẩm (top 10 theo viewCount)
    const topProducts = products
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10)
      .map((p) => ({
        id: p.id,
        name: p.name,
        views: p.viewCount || 0,
        status: p.status,
      }));

    // 4) Tổng quan nhanh
    const totalViewsAll = products.reduce(
      (sum, p) => sum + (p.viewCount || 0),
      0,
    );
    const activeProducts = products.filter((p) => p.status === 'ACTIVE').length;

    return {
      overview: {
        totalViews: totalViewsAll,
        totalProducts: products.length,
        activeProducts,
        avgViewsPerProduct:
          products.length > 0 ? Math.round(totalViewsAll / products.length) : 0,
      },
      dailyViews: dailyData,
      monthlyViews: monthlyData,
      topProducts,
    };
  }
}
