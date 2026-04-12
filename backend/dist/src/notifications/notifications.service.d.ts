import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    getNotifications(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        link: string | null;
        type: string;
        title: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAsRead(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        link: string | null;
        type: string;
        title: string;
        isRead: boolean;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        link: string | null;
        type: string;
        title: string;
        isRead: boolean;
    }>;
}
