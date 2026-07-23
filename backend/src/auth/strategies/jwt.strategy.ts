import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  role: string;
}

const cookieExtractor = (req: any) => {
  let token = null;
  if (req && req.cookies && req.cookies['mivn5_token']) {
    token = req.cookies['mivn5_token'];
  } else if (req && req.headers && req.headers.cookie) {
    const rawCookies = req.headers.cookie.split(';');
    for (const cookie of rawCookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === 'mivn5_token') {
        token = value;
        break;
      }
    }
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        cookieExtractor,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'mivn5-secret-key-2026',
    });
  }

  /**
   * Passport tự động gọi hàm này sau khi verify token thành công.
   * Kết quả trả về sẽ được gắn vào request.user
   */
  async validate(payload: JwtPayload) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại trên hệ thống');
    }

    if (user.status === 'SUSPENDED') {
      throw new UnauthorizedException('Tài khoản của bạn đã bị khóa');
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }
}
