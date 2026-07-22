import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  ParseBoolPipe,
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto, CreateFakeSuppDto } from './dto/supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Role, SupplierStatus } from '@prisma/client';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private suppliersService: SuppliersService,
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  // PUBLIC
  @Get()
  findAll(@Query() query: SupplierQueryDto) {
    // Only return verified suppliers to the public;
    query.status = SupplierStatus.VERIFIED;
    return this.suppliersService.findAll(query);
  }

  // PUBLIC
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.suppliersService.findBySlug(slug);
  }

  @Get(':slug/address')
  async findAddressBySlug(
    @Param('slug') slug: string,
    @Query('findPrimary', new ParseBoolPipe({optional: true})) findPrimary?: boolean,
  ) {
    const shouldFindPrimary = findPrimary ?? true;

    try {
      const addresses = await this.prisma.supplierAddressMap.findMany({
        where: { supplierSlug: slug, isPrimary: shouldFindPrimary },
        select: { address: true, isPrimary: true },
      })

      return { found: addresses.length > 0, addresses };

    } catch (error) {
      console.error(`Failed to fetch addreses of supplier ${slug}`, error);
    } 

    return { found: false, addresses: [] };
  }

  @Get(':id/channels')
  async findChannelsById(
    @Param('id') id: string,
  ) {
    try {
      const channels = await this.prisma.supplierChannelMap.findMany({
        where: { supplierId: id },
        select: { url: true, type: true, },
      })

      return { found: channels.length > 0, channels, };

    } catch (error) { console.log(error) }

    return { found: false, channels: [] };
  }

  // PROTECTED: ADMIN ONLY
  @Get('adminShotGun/:slugOrId')
  findBySlugAdmin(@Param('slugOrId') slugOrId: string) {
    return this.suppliersService.findBySlugAdmin(slugOrId);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param(':id') id: string) {
    const supplier =  this.prisma.supplier.delete({ where: {id} });
    return { success: supplier ?? false, supplier };
  }

  // PUBLIC
  @Get(':id/stats')
  getStats(@Param('id') id: string) {
    return this.suppliersService.getStats(id);
  }

  // PROTECTED: Analytics sâu — chỉ supplier chủ sở hữu
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Get(':id/analytics')
  async getAnalytics(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const supplier = await this.prisma.supplier.findUnique({
      where: { userId },
    });
    if (!supplier || supplier.id !== id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể xem phân tích của chính mình',
      );
    }
    return this.suppliersService.getAnalytics(id);
  }

  // PROTECTED: Tạo mới profile nếu chưa có
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Post('me')
  async createMyProfile(@Body() dto: any, @CurrentUser('id') userId: string) {
    return this.suppliersService.createProfile(userId, dto);
  }

  // PROTECTED ADMIN: Verify/Unverify supplier
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/verify')
  async verifySupplier(
    @Param('id') id: string,
    @Body('isVerified') isVerified: boolean,
    @CurrentUser('id') adminId: string,
  ) {
    const result = await this.suppliersService.verifySupplier(id, isVerified);
    await this.auditLogService.log({
      userId: adminId,
      action: isVerified ? 'VERIFY_SUPPLIER' : 'UNVERIFY_SUPPLIER',
      targetType: 'Supplier',
      targetId: id,
      targetName: result.companyName,
    });
    return result;
  }

  // PROTECTED: Chỉ supplier chủ sở hữu mới sửa được, hoặc ADMIN
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSupplierDto,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.role !== 'ADMIN') {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: currentUser.id },
      });
      if (!supplier || supplier.id !== id) {
        throw new ForbiddenException(
          'Bạn chỉ có thể chỉnh sửa hồ sơ của chính mình',
        );
      }
    }
    return this.suppliersService.update(id, dto);
  }

  // PROTECTED: Chỉ supplier chủ sở hữu mới thêm chứng nhận
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Post(':id/certifications')
  async addCertification(
    @Param('id') id: string,
    @Body() body: { name: string; issuedBy?: string; documentUrl?: string },
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.role !== 'ADMIN') {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: currentUser.id },
      });
      if (!supplier || supplier.id !== id) {
        throw new ForbiddenException(
          'Bạn chỉ có thể quản lý chứng nhận của chính mình',
        );
      }
    }
    return this.suppliersService.addCertification(id, body);
  }

  // PROTECTED: Chỉ supplier chủ sở hữu mới xoá chứng nhận
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER', 'ADMIN')
  @Delete(':supplierId/certifications/:certId')
  async deleteCertification(
    @Param('supplierId') supplierId: string,
    @Param('certId') certId: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.role !== 'ADMIN') {
      const supplier = await this.prisma.supplier.findUnique({
        where: { userId: currentUser.id },
      });
      if (!supplier || supplier.id !== supplierId) {
        throw new ForbiddenException(
          'Bạn chỉ có thể quản lý chứng nhận của chính mình',
        );
      }
    }
    return this.suppliersService.deleteCertification(certId, supplierId);
  }

  // Protected: chỉ admin mới được thêm profile
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('create_fake_supplier')
  async createFakeSupp(@Body() dto: CreateFakeSuppDto) {
    return this.suppliersService.createFakeProfile(dto);
  }

  // upgrade forms
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER)
  @Post('upForm/man')
  async addUpgradeFormMan(@Body() dto: CreateFakeSuppDto) {
    return this.suppliersService.createFakeProfile(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPPLIER)
  @Post('upForm/exp')
  async addupgradeFormExp(@Body() dto: CreateFakeSuppDto) {
    return this.suppliersService.createFakeProfile(dto);
  }
}
