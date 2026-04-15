import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        link: string | null;
        createdAt: Date;
    }[]>;
    countUnread(userId: string): Promise<number>;
    markAsRead(id: string, userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    markAllAsRead(userId: string): Promise<import("@prisma/client").Prisma.BatchPayload>;
    createNotification(data: {
        userId: string;
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<{
        id: string;
        userId: string;
        title: string;
        message: string;
        type: string;
        isRead: boolean;
        link: string | null;
        createdAt: Date;
    }>;
    notifyAdmins(data: {
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<void>;
}
