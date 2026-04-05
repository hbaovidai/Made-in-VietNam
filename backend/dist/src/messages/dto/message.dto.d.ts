import { MessageType } from '@prisma/client';
export declare class SendMessageDto {
    conversationId: string;
    content: string;
    type?: MessageType;
    attachments?: string[];
}
export declare class CreateConversationDto {
    targetUserId: string;
    initialMessage?: string;
}
