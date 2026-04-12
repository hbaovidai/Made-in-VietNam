import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('messages')
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  // PROTECTED: Chỉ xem conversations của mình
  @UseGuards(JwtAuthGuard)
  @Get('conversations/:userId')
  getUserConversations(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ) {
    if (currentUserId !== userId)
      throw new ForbiddenException('Không có quyền');
    return this.messagesService.getUserConversations(userId);
  }

  // PROTECTED
  @UseGuards(JwtAuthGuard)
  @Get('conversations/:conversationId/history')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('userId') userId: string,
    @Query('limit') limit = '50',
  ) {
    return this.messagesService.getMessages(
      conversationId,
      userId,
      parseInt(limit),
    );
  }

  // PROTECTED: userId từ JWT
  @UseGuards(JwtAuthGuard)
  @Post('conversations')
  startConversation(
    @Body() dto: CreateConversationDto,
    @CurrentUser('id') userId: string,
  ) {
    return this.messagesService.startConversation(userId, dto);
  }

  // PROTECTED: senderId từ JWT
  @UseGuards(JwtAuthGuard)
  @Post('send')
  sendMessage(
    @Body() dto: SendMessageDto,
    @CurrentUser('id') senderId: string,
  ) {
    return this.messagesService.sendMessage(senderId, dto);
  }
}
