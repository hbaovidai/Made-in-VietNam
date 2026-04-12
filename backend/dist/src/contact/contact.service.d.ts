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
        createdAt: Date;
        email: string;
        fullName: string;
        message: string;
        isRead: boolean;
        subject: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        message: string;
        isRead: boolean;
        subject: string;
    }[]>;
}
