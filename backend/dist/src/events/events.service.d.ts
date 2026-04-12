import { PrismaService } from '../prisma/prisma.service';
export declare class EventsService {
    private prisma;
    constructor(prisma: PrismaService);
    getEvents(): Promise<{
        id: string;
        title: string;
        description: string | null;
        date: Date;
        location: string | null;
        isVirtual: boolean;
        imageUrl: string | null;
        link: string | null;
        createdAt: Date;
    }[]>;
    getEventById(id: string): Promise<{
        id: string;
        title: string;
        description: string | null;
        date: Date;
        location: string | null;
        isVirtual: boolean;
        imageUrl: string | null;
        link: string | null;
        createdAt: Date;
    } | null>;
}
