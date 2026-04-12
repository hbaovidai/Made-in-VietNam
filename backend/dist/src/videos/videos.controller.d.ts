import { VideosService } from './videos.service';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
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
