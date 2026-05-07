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
    markAsRead(id: string, body: {
        isRead: boolean;
    }): Promise<{
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
