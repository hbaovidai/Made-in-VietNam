import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { MessagesService } from './messages.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: true,
  },
  namespace: 'messages',
})
@Injectable()
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('MessagesGateway');

  constructor(private messagesService: MessagesService) {}

  handleConnection(client: Socket) {
    this.logger.log(`⚡ WebSocket Client kết nối: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`❌ WebSocket Client ngắt kết nối: ${client.id}`);
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conversation_${data.conversationId}`);
      this.logger.log(
        `📌 Client ${client.id} đã tham gia room: conversation_${data.conversationId}`,
      );
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conversation_${data.conversationId}`);
      this.logger.log(
        `🚪 Client ${client.id} đã rời room: conversation_${data.conversationId}`,
      );
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: {
      senderId: string;
      conversationId: string;
      content: string;
      type?: any;
      attachments?: string[];
    },
  ) {
    try {
      const message = await this.messagesService.sendMessage(data.senderId, {
        conversationId: data.conversationId,
        content: data.content,
        type: data.type,
        attachments: data.attachments,
      });

      // Bắn event new_message tới tất cả client trong room cuộc hội thoại này
      this.server
        .to(`conversation_${data.conversationId}`)
        .emit('new_message', message);

      return { status: 'ok', message };
    } catch (err: any) {
      return { status: 'error', message: err.message || 'Lỗi gửi tin nhắn' };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    data: { conversationId: string; userId: string; isTyping: boolean },
  ) {
    client.to(`conversation_${data.conversationId}`).emit('user_typing', data);
  }

  // Phương thức helper cho phép các module khác tự động phát tin nhắn real-time
  emitNewMessage(conversationId: string, message: any) {
    if (this.server) {
      this.server
        .to(`conversation_${conversationId}`)
        .emit('new_message', message);
    }
  }
}
