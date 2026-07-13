import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    getMyNotifications(userId: string): Promise<{
        message: string;
        id: string;
        createdAt: Date;
        link: string | null;
        userId: string;
        title: string;
        type: string;
        isRead: boolean;
    }[]>;
    getUnreadCount(userId: string): Promise<{
        count: number;
    }>;
    markAllAsRead(userId: string): Promise<{
        success: boolean;
    }>;
    markAsRead(id: string, userId: string): Promise<{
        success: boolean;
    }>;
}
