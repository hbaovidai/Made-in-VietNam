import { EventsService } from './events.service';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
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
