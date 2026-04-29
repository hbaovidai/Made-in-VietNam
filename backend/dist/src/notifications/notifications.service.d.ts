import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        message: string;
        link: string | null;
        title: string;
        type: string;
        isRead: boolean;
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
        createdAt: Date;
        userId: string;
        message: string;
        link: string | null;
        title: string;
        type: string;
        isRead: boolean;
    }>;
    notifyAdmins(data: {
        title: string;
        message: string;
        type?: string;
        link?: string;
    }): Promise<void>;
}
