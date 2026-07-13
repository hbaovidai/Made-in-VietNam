import { PrismaService } from '../prisma/prisma.service';
export declare class ContactService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: {
        fullName: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        message: string;
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        isRead: boolean;
        subject: string;
    }>;
    findAll(): Promise<{
        message: string;
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        isRead: boolean;
        subject: string;
    }[]>;
    markAsRead(id: string, isRead: boolean): Promise<{
        message: string;
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        isRead: boolean;
        subject: string;
    }>;
    delete(id: string): Promise<{
        message: string;
        id: string;
        email: string;
        fullName: string;
        createdAt: Date;
        isRead: boolean;
        subject: string;
    }>;
}
