import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private googleClient: OAuth2Client;

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.googleClient = new OAuth2Client(
      this.configService.get('GOOGLE_CLIENT_ID'),
    );
  }

  /**
   * Tạo JWT token cho user
   */
  private generateToken(user: {
    id: string;
    email: string;
    role: string;
  }): string {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }

  async register(dto: RegisterDto) {
    // Check if email already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email đã được sử dụng');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, 10);

    // Create user
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

    let supplierProfile = null;
    // If supplier, create supplier profile
    if (dto.role === 'SUPPLIER' && dto.companyName) {
      const slug = dto.companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      supplierProfile = await this.prisma.supplier.create({
        data: {
          userId: user.id,
          companyName: dto.companyName,
          slug: `${slug}-${Date.now()}`,
        },
      });
    }

    // Tạo JWT token
    const token = this.generateToken(user);

    return {
      message: 'Đăng ký thành công',
      user: {
        ...user,
        supplier: supplierProfile
      },
      token,
    };
  }

  async login(dto: LoginDto) {
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        supplier: {
          select: {
            id: true,
            companyName: true,
            slug: true,
            isVerified: true,
            verificationStatus: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Check password
    const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng');
    }

    // Tạo JWT token
    const token = this.generateToken(user);

    // Return user data + token
    const { passwordHash, ...userData } = user;
    return {
      message: 'Đăng nhập thành công',
      user: userData,
      token,
    };
  }

  async googleLogin(data: { credential: string; email: string; name: string; picture?: string }) {
    const { email, name, picture } = data;

    if (!email) {
      throw new UnauthorizedException('Không lấy được email từ Google');
    }

    // 1) Tìm user trong DB
    let user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        supplier: {
          select: { id: true, companyName: true, slug: true, isVerified: true, verificationStatus: true },
        },
      },
    });

    // 2) Nếu chưa có → tạo mới (mặc định BUYER)
    if (!user) {
      const randomPassword = await bcrypt.hash(
        Math.random().toString(36).slice(-12),
        10,
      );
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
            select: { id: true, companyName: true, slug: true, isVerified: true, verificationStatus: true },
          },
        },
      });
    }

    // 3) Tạo JWT token
    const token = this.generateToken(user);

    const { passwordHash, ...userData } = user;
    return {
      message: 'Đăng nhập Google thành công',
      user: userData,
      token,
    };
  }

  async getProfile(userId: string) {
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
            verificationStatus: true,
            logo: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User không tồn tại');
    }

    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User không tồn tại');

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

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedException('User không tồn tại');

    const isMatch = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isMatch) {
      throw new UnauthorizedException('Mật khẩu cũ không đúng');
    }

    const newHash = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    return { message: 'Đổi mật khẩu thành công' };
  }
}
