"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const bcrypt = __importStar(require("bcrypt"));
const google_auth_library_1 = require("google-auth-library");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    configService;
    googleClient;
    constructor(prisma, jwtService, configService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.configService = configService;
        this.googleClient = new google_auth_library_1.OAuth2Client(this.configService.get('GOOGLE_CLIENT_ID'));
    }
    generateToken(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return this.jwtService.sign(payload);
    }
    async register(dto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email đã được sử dụng');
        }
        const passwordHash = await bcrypt.hash(dto.password, 10);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                fullName: dto.fullName,
                role: dto.role,
                phone: dto.phone,
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                phone: true,
                createdAt: true,
            },
        });
        if (dto.role === 'SUPPLIER' && dto.companyName) {
            const slug = dto.companyName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            await this.prisma.supplier.create({
                data: {
                    userId: user.id,
                    companyName: dto.companyName,
                    slug: `${slug}-${Date.now()}`,
                },
            });
        }
        const token = this.generateToken(user);
        return {
            message: 'Đăng ký thành công',
            user,
            token,
        };
    }
    async login(dto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            include: {
                supplier: {
                    select: {
                        id: true,
                        companyName: true,
                        slug: true,
                        isVerified: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Email hoặc mật khẩu không đúng');
        }
        const token = this.generateToken(user);
        const { passwordHash, ...userData } = user;
        return {
            message: 'Đăng nhập thành công',
            user: userData,
            token,
        };
    }
    async googleLogin(data) {
        const { email, name, picture } = data;
        if (!email) {
            throw new common_1.UnauthorizedException('Không lấy được email từ Google');
        }
        let user = await this.prisma.user.findUnique({
            where: { email },
            include: {
                supplier: {
                    select: { id: true, companyName: true, slug: true, isVerified: true },
                },
            },
        });
        if (!user) {
            const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);
            user = await this.prisma.user.create({
                data: {
                    email,
                    passwordHash: randomPassword,
                    fullName: name || email.split('@')[0],
                    role: 'BUYER',
                    avatar: picture || null,
                },
                include: {
                    supplier: {
                        select: { id: true, companyName: true, slug: true, isVerified: true },
                    },
                },
            });
        }
        const token = this.generateToken(user);
        const { passwordHash, ...userData } = user;
        return {
            message: 'Đăng nhập Google thành công',
            user: userData,
            token,
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                phone: true,
                avatar: true,
                status: true,
                createdAt: true,
                supplier: {
                    select: {
                        id: true,
                        companyName: true,
                        slug: true,
                        isVerified: true,
                        logo: true,
                    },
                },
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException('User không tồn tại');
        }
        return user;
    }
    async updateProfile(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User không tồn tại');
        const updated = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...(dto.fullName && { fullName: dto.fullName }),
                ...(dto.phone !== undefined && { phone: dto.phone }),
                ...(dto.avatar !== undefined && { avatar: dto.avatar }),
            },
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                phone: true,
                avatar: true,
                status: true,
                createdAt: true,
            },
        });
        return { message: 'Cập nhật thông tin thành công', user: updated };
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.UnauthorizedException('User không tồn tại');
        const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Mật khẩu cũ không đúng');
        }
        const newHash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash: newHash },
        });
        return { message: 'Đổi mật khẩu thành công' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map