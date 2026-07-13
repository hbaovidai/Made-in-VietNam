import { ContactService } from './contact.service';
export declare class ContactController {
    private contactService;
    constructor(contactService: ContactService);
    submit(body: {
        fullName: string;
        email: string;
        subject: string;
        message: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        email: string;
        fullName: string;
        isRead: boolean;
        subject: string;
    }>;
    findAll(): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        email: string;
        fullName: string;
        isRead: boolean;
        subject: string;
    }[]>;
    markAsRead(id: string, body: {
        isRead: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        email: string;
        fullName: string;
        isRead: boolean;
        subject: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        createdAt: Date;
        message: string;
        email: string;
        fullName: string;
        isRead: boolean;
        subject: string;
    }>;
}
