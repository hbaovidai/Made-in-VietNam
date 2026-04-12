import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsOptional,
  IsArray,
} from 'class-validator';
import { MessageType } from '@prisma/client';

export class SendMessageDto {
  @IsString() @IsNotEmpty() conversationId: string;
  @IsString() @IsNotEmpty() content: string;
  @IsEnum(MessageType) @IsOptional() type?: MessageType = 'TEXT';
  @IsArray() @IsString({ each: true }) @IsOptional() attachments?: string[];
}

export class CreateConversationDto {
  @IsString() @IsNotEmpty() targetUserId: string;
  @IsString() @IsOptional() initialMessage?: string;
}
