import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserConversations(userId: string): Promise<{
        id: string;
        unreadCount: number;
        lastMessage: string | null;
        lastMessageAt: Date | null;
        targetUser: {
            supplier: {
                id: string;
            } | null;
            id: string;
            fullName: string;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
        };
        rfq: {
            id: string;
            contactEmail: string | null;
            contactPhone: string | null;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.RFQStatus;
            category: string;
            quantity: number;
            productName: string;
            quantityUnit: string;
            budget: string | null;
            destination: string;
            contactName: string | null;
            expiresAt: Date;
            buyerId: string;
        } | null;
    }[]>;
    getAllConversations(): Promise<{
        id: any;
        buyerName: any;
        buyerEmail: any;
        supplierName: any;
        supplierEmail: any;
        lastMessage: any;
        lastMessageAt: any;
        updatedAt: any;
        status: string;
        unread: boolean;
        participants: any;
    }[]>;
    getMessages(conversationId: string, userId: string, limit?: number, skip?: number): Promise<({
        sender: {
            id: string;
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.MessageType;
        conversationId: string;
        content: string;
        attachments: string[];
        senderId: string;
    })[]>;
    startConversation(userId: string, dto: CreateConversationDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    sendMessage(senderId: string, dto: SendMessageDto): Promise<any>;
    deleteConversation(conversationId: string, userId: string): Promise<{
        message: string;
    }>;
}
