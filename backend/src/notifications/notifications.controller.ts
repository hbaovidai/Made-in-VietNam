import { Controller, Get, Patch, Post, Body, Param, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async getMyNotifications(@CurrentUser('id') userId: string) {
    return this.notificationsService.findAllForUser(userId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('id') userId: string) {
    const count = await this.notificationsService.countUnread(userId);
    return { count };
  }

  @Patch('read-all')
  async markAllAsRead(@CurrentUser('id') userId: string) {
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.notificationsService.markAsRead(id, userId);
    return { success: true };
  }

  // Admin Broadcast notification to all active users
  @Post('broadcast')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async broadcastNotification(
    @Body() body: { title: string; message: string; type?: string; link?: string }
  ) {
    await this.notificationsService.broadcast(body);
    return { success: true, message: 'Đã phát thông báo toàn hệ thống.' };
  }
}
