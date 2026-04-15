import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { Prisma, ProductStatus } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  async findAll(query: ProductQueryDto) {
    const {
      search,
      category,
      supplierId,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      status, // Bổ sung status filter
    } = query;

    const where: Prisma.ProductWhereInput = {};

    // Nếu có truyền status (do admin filter) thì lấy status đó, ngược lại mặc định chỉ lấy ACTIVE cho public view
    if (status) {
      where.status = status as ProductStatus;
    } else {
      where.status = 'ACTIVE';
    }

    // Search by name
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    // Filter by category slug (match the category itself or any of its children)
    if (category) {
      where.category = {
        OR: [{ slug: category }, { parent: { slug: category } }],
      };
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
          supplier: {
            select: {
              id: true,
              companyName: true,
              slug: true,
              isVerified: true,
              logo: true,
            },
          },
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

  async findByIdOrSlug(idOrSlug: string) {
    // Try finding by ID first (UUID format), then fall back to slug
    let product = null;

    // UUID pattern check
    const isUUID =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      );

    if (isUUID) {
      product = await this.prisma.product.findUnique({
        where: { id: idOrSlug },
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
    }

    if (!product) {
      product = await this.prisma.product.findUnique({
        where: { slug: idOrSlug },
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
    }

    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    // MIVN5 logic: Increment view count for the requested product
    await this.prisma.product.update({
      where: { id: product.id },
      data: { viewCount: { increment: 1 } },
    });

    return product;
  }

  // Lấy toàn bộ danh sách sản phẩm cho Owner UI
  async findAllForSupplier(supplierId: string) {
    return this.prisma.product.findMany({
      where: { supplierId },
      orderBy: { createdAt: 'desc' },
      include: {
        category: { select: { name: true, slug: true } },
      }
    });
  }

  async create(supplierId: string, dto: CreateProductDto) {
    const slug =
      dto.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') +
      '-' +
      Date.now();

    const product = await this.prisma.product.create({
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

    // Notify Admins
    try {
      await this.notificationsService.notifyAdmins({
        title: 'Sản phẩm mới cần duyệt',
        message: `Xưởng vừa đăng sản phẩm "${product.name}". Vui lòng kiểm duyệt nội dung.`,
        link: '/dashboard/admin/products',
        type: 'warning'
      });
    } catch (err) {
      console.error('Failed to notify admins:', err);
    }

    return product;
  }

  async update(
    productId: string,
    supplierId: string | null,
    dto: UpdateProductDto,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    if (supplierId && product.supplierId !== supplierId)
      throw new ForbiddenException('Không có quyền chỉnh sửa');

    // Nếu Supplier tự update, sản phẩm REJECTED sẽ tự động được gửi duyệt lại (về PENDING)
    let newStatus = dto.status || product.status;
    if (supplierId && product.status === ProductStatus.REJECTED) {
      newStatus = ProductStatus.PENDING;
    }

    // Không cho phép Supplier tự đổi status sang ACTIVE
    if (supplierId && newStatus === ProductStatus.ACTIVE && product.status !== ProductStatus.ACTIVE) {
      newStatus = ProductStatus.PENDING;
    }

    return this.prisma.product.update({
      where: { id: productId },
      data: { ...dto, status: newStatus as ProductStatus },
      include: {
        category: { select: { name: true, slug: true } },
      },
    });
  }

  async delete(productId: string, supplierId: string | null) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');
    if (supplierId && product.supplierId !== supplierId)
      throw new ForbiddenException('Không có quyền xóa');

    await this.prisma.product.delete({ where: { id: productId } });
    return { message: 'Đã xóa sản phẩm' };
  }

  // Sản phẩm liên quan (cùng category)
  async findRelated(productId: string, limit: number = 6) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
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

  // Admin Duyệt sản phẩm
  async verifyProduct(productId: string, status: 'ACTIVE' | 'REJECTED') {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    return this.prisma.product.update({
      where: { id: productId },
      data: { status },
    });
  }
}
