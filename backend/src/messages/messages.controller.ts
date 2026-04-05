import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Get('conversations/:userId')
  getUserConversations(@Param('userId') userId: string) {
    return this.messagesService.getUserConversations(userId);
  }

  @Get('conversations/:conversationId/history')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('userId') userId: string,
    @Query('limit') limit = '50'
  ) {
    return this.messagesService.getMessages(conversationId, userId, parseInt(limit));
  }

  @Post('conversations')
  startConversation(@Body() body: CreateConversationDto & { userId: string }) {
    const { userId, ...dto } = body;
    return this.messagesService.startConversation(userId, dto);
  }

  @Post('send')
  sendMessage(@Body() body: SendMessageDto & { senderId: string }) {
    const { senderId, ...dto } = body;
    return this.messagesService.sendMessage(senderId, dto);
  }
}
