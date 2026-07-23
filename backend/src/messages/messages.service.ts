import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SendMessageDto, CreateConversationDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async getUserConversations(userId: string) {
    const participants = await this.prisma.conversationParticipant.findMany({
      where: { userId },
      include: {
        conversation: {
          include: {
            participants: {
              where: { userId: { not: userId } },
              include: {
                user: {
                  select: {
                    id: true,
                    fullName: true,
                    avatar: true,
                    role: true,
                    supplier: {
                      select: {
                        id: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { conversation: { updatedAt: 'desc' } },
    });

    const results = [];
    for (const p of participants) {
      const targetUser = p.conversation.participants[0]?.user;
      let rfq = null;
      if (targetUser) {
        const rfqQuote = await this.prisma.quote.findFirst({
          where: {
            OR: [
              {
                supplier: { userId: userId },
                rfq: { buyerId: targetUser.id },
              },
              {
                supplier: { userId: targetUser.id },
                rfq: { buyerId: userId },
              },
            ],
          },
          include: {
            rfq: true,
          },
          orderBy: { createdAt: 'desc' },
        });
        if (rfqQuote) {
          rfq = rfqQuote.rfq;
        }
      }

      results.push({
        id: p.conversation.id,
        unreadCount: p.unreadCount,
        lastMessage: p.conversation.lastMessage,
        lastMessageAt: p.conversation.lastMessageAt,
        targetUser: targetUser || null,
        rfq: rfq,
      });
    }

    return results;
  }

  async getAllConversations() {
    const conversations = await this.prisma.conversation.findMany({
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
                avatar: true,
                supplier: {
                  select: {
                    companyName: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return conversations.map((c: any) => {
      const p1 = c.participants[0]?.user;
      const p2 = c.participants[1]?.user;

      const buyerPart = c.participants.find((p: any) => p.user.role === 'BUYER');
      const supplierPart = c.participants.find((p: any) => p.user.role === 'SUPPLIER');

      const bName = buyerPart?.user.fullName || (p1 ? p1.fullName : 'Khách hàng');
      const bEmail = buyerPart?.user.email || (p1 ? p1.email : 'N/A');

      const sName = supplierPart?.user.supplier?.companyName || supplierPart?.user.fullName || (p2 ? (p2.supplier?.companyName || p2.fullName) : 'Nhà cung cấp');
      const sEmail = supplierPart?.user.email || (p2 ? p2.email : 'N/A');

      return {
        id: c.id,
        buyerName: bName,
        buyerEmail: bEmail,
        supplierName: sName,
        supplierEmail: sEmail,
        lastMessage: c.lastMessage,
        lastMessageAt: c.lastMessageAt,
        updatedAt: c.updatedAt,
        status: 'active',
        unread: false,
        participants: c.participants,
      };
    });
  }

  async getAdminMessages(conversationId: string, limit = 50, skip = 0) {
    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    });
  }

  async deleteAdminConversation(conversationId: string) {
    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });
    return { message: 'Đã xóa cuộc hội thoại' };
  }

  async getMessages(
    conversationId: string,
    userId: string,
    limit = 50,
    skip = 0,
  ) {
    // Verify participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant)
      throw new ForbiddenException('Bạn không nằm trong hội thoại này');

    // Reset unread count
    if (participant.unreadCount > 0) {
      await this.prisma.conversationParticipant.update({
        where: { id: participant.id },
        data: { unreadCount: 0 },
      });
    }

    return this.prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip,
      include: { sender: { select: { id: true, fullName: true } } },
    });
  }

  async startConversation(userId: string, dto: CreateConversationDto) {
    if (userId === dto.targetUserId)
      throw new BadRequestException('Không thể tự nhắn tin cho mình');

    // Check if conversation exists
    const existing = await this.prisma.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: dto.targetUserId } } },
        ],
      },
    });

    if (existing) return existing;

    // Create new
    return this.prisma.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: dto.targetUserId }],
        },
        ...(dto.initialMessage && {
          lastMessage: dto.initialMessage,
          lastMessageAt: new Date(),
          messages: {
            create: { senderId: userId, content: dto.initialMessage },
          },
        }),
      },
    });
  }

  async sendMessage(senderId: string, dto: SendMessageDto) {
    // Verify participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: {
        conversationId_userId: {
          conversationId: dto.conversationId,
          userId: senderId,
        },
      },
    });
    if (!participant)
      throw new ForbiddenException('Bạn không nằm trong hội thoại này');

    // Transaction to insert message + update unread count for OTHERS
    return this.prisma.$transaction(async (tx: any) => {
      const message = await tx.message.create({
        data: {
          conversationId: dto.conversationId,
          senderId,
          content: dto.content,
          type: dto.type,
          attachments: dto.attachments || [],
        },
      });

      // Update conversation last message info
      await tx.conversation.update({
        where: { id: dto.conversationId },
        data: { lastMessage: dto.content, lastMessageAt: new Date() },
      });

      // Increment unread count for target users
      await tx.conversationParticipant.updateMany({
        where: {
          conversationId: dto.conversationId,
          userId: { not: senderId },
        },
        data: { unreadCount: { increment: 1 } },
      });

      return message;
    });
  }

  async deleteConversation(conversationId: string, userId: string) {
    // Verify user is a participant
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant)
      throw new ForbiddenException('Bạn không nằm trong hội thoại này');

    // Delete conversation (cascade will remove participants + messages)
    await this.prisma.conversation.delete({
      where: { id: conversationId },
    });

    return { message: 'Đã xóa cuộc hội thoại' };
  }
}
