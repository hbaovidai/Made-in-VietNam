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
        id: string;
        fullName: string;
        email: string;
        subject: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    findAll(): Promise<{
        id: string;
        fullName: string;
        email: string;
        subject: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }[]>;
    markAsRead(id: string, isRead: boolean): Promise<{
        id: string;
        fullName: string;
        email: string;
        subject: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
    delete(id: string): Promise<{
        id: string;
        fullName: string;
        email: string;
        subject: string;
        message: string;
        isRead: boolean;
        createdAt: Date;
    }>;
}
