import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  ForbiddenException,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuditLogService } from '../audit-log/audit-log.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly auditLogService: AuditLogService,
  ) {}

  // PROTECTED ADMIN: Xem tất cả người dùng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllUsers(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  // PROTECTED ADMIN: Khóa / Mở khóa tài khoản
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/status')
  async toggleUserStatus(
    @Param('id') id: string,
    @Body('status') status: 'ACTIVE' | 'SUSPENDED',
    @CurrentUser('id') adminId: string,
  ) {
    const result = await this.usersService.toggleUserStatus(id, status);
    await this.auditLogService.log({
      userId: adminId,
      action: status === 'SUSPENDED' ? 'LOCK_USER' : 'UNLOCK_USER',
      targetType: 'User',
      targetId: id,
      targetName: result.fullName || result.email,
    });
    return result;
  }
 
  // PROTECTED ADMIN: Cập nhật vai trò người dùng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id/role')
  async updateUserRole(
    @Param('id') id: string,
    @Body('role') role: 'ADMIN' | 'SUPPLIER' | 'BUYER',
    @CurrentUser('id') adminId: string,
  ) {
    const result = await this.usersService.updateUserRole(id, role);
    await this.auditLogService.log({
      userId: adminId,
      action: 'UPDATE_USER_ROLE',
      targetType: 'User',
      targetId: id,
      targetName: `${result.fullName || result.email} to ${role}`,
    });
    return result;
  }

  // PROTECTED ADMIN: Xóa người dùng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser('id') adminId: string,
  ) {
    const result = await this.usersService.deleteUser(id);
    await this.auditLogService.log({
      userId: adminId,
      action: 'DELETE_USER',
      targetType: 'User',
      targetId: id,
      targetName: `${result.fullName} (${result.email})`,
    });
    return { message: `Đã xóa người dùng ${result.fullName}` };
  }

  // PROTECTED: Xem sản phẩm đã lưu (Tự động lấy ID người dùng đăng nhập)
  @UseGuards(JwtAuthGuard)
  @Get(':id/saved')
  getSavedProducts(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    const targetId =
      currentUser.role === 'ADMIN' && id !== 'me' ? id : currentUser.id;
    return this.usersService.getSavedProducts(targetId);
  }

  // PROTECTED: Chỉ lưu sản phẩm cho mình
  @UseGuards(JwtAuthGuard)
  @Post(':id/saved')
  saveProduct(
    @Param('id') id: string,
    @Body('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.saveProduct(userId, productId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/saved/:productId')
  unsaveProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.unsaveProduct(userId, productId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/saved')
  clearSavedProducts(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.usersService.clearSavedProducts(userId);
  }

  // PROTECTED: Xem lịch sử (Tự động lấy ID người dùng đăng nhập)
  @UseGuards(JwtAuthGuard)
  @Get(':id/history')
  getViewHistory(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    const targetId =
      currentUser.role === 'ADMIN' && id !== 'me' ? id : currentUser.id;
    return this.usersService.getViewHistory(targetId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Post(':id/history')
  recordView(
    @Param('id') id: string,
    @Body('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.recordView(id, productId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/history/:historyId')
  deleteHistoryItem(
    @Param('id') id: string,
    @Param('historyId') historyId: string,
    @CurrentUser('id') userId: string,
  ) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.deleteHistoryItem(id, historyId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/history')
  clearHistory(@Param('id') id: string, @CurrentUser('id') userId: string) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.clearHistory(id);
  }
}
