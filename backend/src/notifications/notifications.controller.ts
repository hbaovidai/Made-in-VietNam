import {
  Controller,
  Get,
  Put,
  Param,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // PROTECTED: Chỉ xem thông báo của mình
  @UseGuards(JwtAuthGuard)
  @Get(':userId/unread-count')
  getUnreadCount(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (currentUserId !== userId)
      throw new ForbiddenException('Không có quyền');
    return this.notificationsService.getUnreadCount(userId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  getNotifications(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (currentUserId !== userId)
      throw new ForbiddenException('Không có quyền');
    return this.notificationsService.getNotifications(userId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Put(':userId/read-all')
  markAllAsRead(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (currentUserId !== userId)
      throw new ForbiddenException('Không có quyền');
    return this.notificationsService.markAllAsRead(userId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Put(':id/read')
  markAsRead(@Param('id') id: string) {
    return this.notificationsService.markAsRead(id);
  }
}
