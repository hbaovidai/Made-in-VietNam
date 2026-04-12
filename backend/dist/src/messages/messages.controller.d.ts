import { MessagesService } from './messages.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';
export declare class MessagesController {
    private messagesService;
    constructor(messagesService: MessagesService);
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
        conversationId: string;
        content: string;
        type: import("@prisma/client").$Enums.MessageType;
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
}
