import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
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
    markAllAsRead(userId: string): Promise<{
        success: boolean;
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
}
