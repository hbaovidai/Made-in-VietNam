import {
  Controller,
  Get,
  Post,
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

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // PROTECTED ADMIN: Xem tất cả người dùng
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getAllUsers(@Query() query: any) {
    return this.usersService.findAll(query);
  }

  // PROTECTED: Chỉ xem sản phẩm đã lưu của mình
  @UseGuards(JwtAuthGuard)
  @Get(':id/saved')
  getSavedProducts(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Bạn chỉ có thể xem danh sách của chính mình',
      );
    }
    return this.usersService.getSavedProducts(id);
  }

  // PROTECTED: Chỉ lưu sản phẩm cho mình
  @UseGuards(JwtAuthGuard)
  @Post(':id/saved')
  saveProduct(
    @Param('id') id: string,
    @Body('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.saveProduct(id, productId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/saved/:productId')
  unsaveProduct(
    @Param('id') id: string,
    @Param('productId') productId: string,
    @CurrentUser('id') userId: string,
  ) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.unsaveProduct(id, productId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Delete(':id/saved')
  clearSavedProducts(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    if (userId !== id) throw new ForbiddenException('Không có quyền');
    return this.usersService.clearSavedProducts(id);
  }

  // PROTECTED: Chỉ xem lịch sử của mình
  @UseGuards(JwtAuthGuard)
  @Get(':id/history')
  getViewHistory(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn chỉ có thể xem lịch sử của chính mình');
    }
    return this.usersService.getViewHistory(id);
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
