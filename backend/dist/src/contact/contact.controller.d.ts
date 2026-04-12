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
