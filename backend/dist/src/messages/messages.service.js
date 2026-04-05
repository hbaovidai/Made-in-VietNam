"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessagesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MessagesService = class MessagesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getUserConversations(userId) {
        const participants = await this.prisma.conversationParticipant.findMany({
            where: { userId },
            include: {
                conversation: {
                    include: {
                        participants: {
                            where: { userId: { not: userId } },
                            include: { user: { select: { id: true, fullName: true, avatar: true, role: true } } }
                        }
                    }
                }
            },
            orderBy: { conversation: { updatedAt: 'desc' } }
        });
        return participants.map((p) => ({
            id: p.conversation.id,
            unreadCount: p.unreadCount,
            lastMessage: p.conversation.lastMessage,
            lastMessageAt: p.conversation.lastMessageAt,
            targetUser: p.conversation.participants[0]?.user || null
        }));
    }
    async getMessages(conversationId, userId, limit = 50, skip = 0) {
        const participant = await this.prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId, userId } }
        });
        if (!participant)
            throw new common_1.ForbiddenException('Bạn không nằm trong hội thoại này');
        if (participant.unreadCount > 0) {
            await this.prisma.conversationParticipant.update({
                where: { id: participant.id },
                data: { unreadCount: 0 }
            });
        }
        return this.prisma.message.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip,
            include: { sender: { select: { id: true, fullName: true } } }
        });
    }
    async startConversation(userId, dto) {
        if (userId === dto.targetUserId)
            throw new common_1.BadRequestException('Không thể tự nhắn tin cho mình');
        const existing = await this.prisma.conversation.findFirst({
            where: {
                AND: [
                    { participants: { some: { userId } } },
                    { participants: { some: { userId: dto.targetUserId } } },
                ]
            }
        });
        if (existing)
            return existing;
        return this.prisma.conversation.create({
            data: {
                participants: {
                    create: [{ userId }, { userId: dto.targetUserId }]
                },
                ...(dto.initialMessage && {
                    lastMessage: dto.initialMessage,
                    lastMessageAt: new Date(),
                    messages: {
                        create: { senderId: userId, content: dto.initialMessage }
                    }
                })
            }
        });
    }
    async sendMessage(senderId, dto) {
        const participant = await this.prisma.conversationParticipant.findUnique({
            where: { conversationId_userId: { conversationId: dto.conversationId, userId: senderId } }
        });
        if (!participant)
            throw new common_1.ForbiddenException('Bạn không nằm trong hội thoại này');
        return this.prisma.$transaction(async (tx) => {
            const message = await tx.message.create({
                data: {
                    conversationId: dto.conversationId,
                    senderId,
                    content: dto.content,
                    type: dto.type,
                    attachments: dto.attachments || []
                }
            });
            await tx.conversation.update({
                where: { id: dto.conversationId },
                data: { lastMessage: dto.content, lastMessageAt: new Date() }
            });
            await tx.conversationParticipant.updateMany({
                where: { conversationId: dto.conversationId, userId: { not: senderId } },
                data: { unreadCount: { increment: 1 } }
            });
            return message;
        });
    }
};
exports.MessagesService = MessagesService;
exports.MessagesService = MessagesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MessagesService);
//# sourceMappingURL=messages.service.js.map