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
} from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('suppliers')
export class SuppliersController {
  constructor(
    private suppliersService: SuppliersService,
    private prisma: PrismaService,
    private auditLogService: AuditLogService,
  ) {}

  // Protected: Chỉ Admin mới được lấy hết danh sách các supplier
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  findAll(@Query() query: SupplierQueryDto) {
    return this.suppliersService.findAll(query);
  }

  // Protected
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.suppliersService.findBySlug(slug);
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
    const supplier = await this.prisma.supplier.findUnique({ where: { userId } });
    if (!supplier || supplier.id !== id) {
      throw new ForbiddenException('Bạn chỉ có thể xem phân tích của chính mình');
    }
    return this.suppliersService.getAnalytics(id);
  }

  // PROTECTED: Tạo mới profile nếu chưa có
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPPLIER')
  @Post('me')
  async createMyProfile(
    @Body() dto: any,
    @CurrentUser('id') userId: string,
  ) {
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
}
