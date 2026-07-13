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
            role: import("@prisma/client").$Enums.Role;
            fullName: string;
            avatar: string | null;
        };
        rfq: {
            category: string;
            id: string;
            status: import("@prisma/client").$Enums.RFQStatus;
            createdAt: Date;
            updatedAt: Date;
            contactEmail: string | null;
            contactPhone: string | null;
            description: string;
            buyerId: string;
            productName: string;
            quantity: number;
            quantityUnit: string;
            budget: string | null;
            destination: string;
            contactName: string | null;
            expiresAt: Date;
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
        conversationId: string;
        createdAt: Date;
        senderId: string;
        content: string;
        type: import("@prisma/client").$Enums.MessageType;
        attachments: string[];
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
