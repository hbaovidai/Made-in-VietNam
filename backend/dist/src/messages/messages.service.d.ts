import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';
export declare class MessagesService {
    private prisma;
    constructor(prisma: PrismaService);
    getUserConversations(userId: string): Promise<{
        id: any;
        unreadCount: any;
        lastMessage: any;
        lastMessageAt: any;
        targetUser: any;
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
}
