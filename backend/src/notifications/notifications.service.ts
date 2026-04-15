import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  async findAllForUser(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async countUnread(userId: string) {
    return this.prisma.notification.count({
      where: { userId, isRead: false },
    });
  }

  async markAsRead(id: string, userId: string) {
    return this.prisma.notification.updateMany({
      where: { id, userId },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  // Internal trigger
  async createNotification(data: { userId: string, title: string, message: string, type?: string, link?: string }) {
    return this.prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        link: data.link,
      }
    });
  }

  // Trigger to ALL admins
  async notifyAdmins(data: { title: string, message: string, type?: string, link?: string }) {
    const admins = await this.prisma.user.findMany({ where: { role: 'ADMIN', status: 'ACTIVE' }, select: { id: true } });
    if (admins.length > 0) {
      await this.prisma.notification.createMany({
        data: admins.map(a => ({
          userId: a.id,
          title: data.title,
          message: data.message,
          type: data.type || 'info',   
          link: data.link,
        }))
      });
    }
  }
}
