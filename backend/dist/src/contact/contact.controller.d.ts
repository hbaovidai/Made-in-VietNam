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
    markAsRead(id: string, body: {
        isRead: boolean;
    }): Promise<{
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
