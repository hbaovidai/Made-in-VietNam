import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductQueryDto,
} from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';

@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private prisma: PrismaService,
  ) {}

  // PUBLIC: Ai cũng xem được danh sách sản phẩm
  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll({ ...query, status: 'ACTIVE' }); // Luôn ép public thành ACTIVE
  }

  // PROTECTED: Admin được lấy dữ liệu sản phẩm theo status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  findAllForAdmin(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query, true);
  }

  // PROTECTED: Lấy toàn bộ sản phẩm của chính Supplier (bao gồm PENDING, REJECTED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Get('me')
  async getMyProducts(@CurrentUser('id') userId: string) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    return this.productsService.findAllForSupplier(supplier.id);
  }

  // PUBLIC: Ai cũng xem được chi tiết sản phẩm
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findByIdOrSlug(slug);
  }

  // PUBLIC: Sản phẩm liên quan
  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.productsService.findRelated(id);
  }

  // PROTECTED: Chỉ SUPPLIER mới tạo được sản phẩm
  // supplierId lấy từ JWT token, KHÔNG từ body
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER)
  @Post()
  async create(
    @Body() dto: CreateProductDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.productsService.create(userId, dto);
  }

  // PROTECTED: SUPPLIER chỉ sửa sản phẩm của mình, ADMIN sửa tất cả
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.role === 'ADMIN') {
      // Admin có thể sửa bất kỳ sản phẩm nào — pass null để skip ownership check
      return this.productsService.update(id, null, dto);
    }
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId: currentUser.id },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    return this.productsService.update(id, supplier.id, dto);
  }

  // PROTECTED: SUPPLIER chỉ xoá sản phẩm của mình, ADMIN xoá tất cả
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Delete(':id')
  async delete(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.role === 'ADMIN') {
      return this.productsService.delete(id, null);
    }
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId: currentUser.id },
    });
    if (!supplier)
      throw new ForbiddenException('Tài khoản chưa có hồ sơ nhà cung cấp');
    return this.productsService.delete(id, supplier.id);
  }

  // PROTECTED ADMIN: Verify/Reject product
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/verify')
  verifyProduct(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'REJECTED',
    @Body('reason') reason?: string,
  ) {
    return this.productsService.verifyProduct(id, status, reason);
  }
}
