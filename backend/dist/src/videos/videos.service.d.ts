import { PrismaService } from '../prisma/prisma.service';
export declare class VideosService {
    private prisma;
    constructor(prisma: PrismaService);
    getVideos(): Promise<{
        id: string;
        title: string;
        youtubeId: string;
        duration: string | null;
        category: string | null;
        createdAt: Date;
    }[]>;
    getVideoById(id: string): Promise<{
        id: string;
        title: string;
        youtubeId: string;
        duration: string | null;
        category: string | null;
        createdAt: Date;
    } | null>;
}
