import { MessagesService } from './messages.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
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
    getAdminMessages(conversationId: string, userId: string): Promise<({
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
    getUserConversations(userId: string, currentUserId: string): Promise<{
        id: any;
        unreadCount: any;
        lastMessage: any;
        lastMessageAt: any;
        targetUser: any;
    }[]>;
    getMessages(conversationId: string, userId: string, limit?: string): Promise<({
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
    startConversation(dto: CreateConversationDto, userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        lastMessage: string | null;
        lastMessageAt: Date | null;
    }>;
    sendMessage(dto: SendMessageDto, senderId: string): Promise<any>;
    deleteConversation(conversationId: string, userId: string): Promise<{
        message: string;
    }>;
}
