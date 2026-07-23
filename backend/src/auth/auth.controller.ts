import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Res,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  UserRegisterDto,
  LoginDto,
  UpdateProfileDto,
  ChangePasswordDto,
  GoogleLoginDto,
  SupplierRegisterDto,
  ForgotPasswordDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  private setTokenCookie(res: any, token: string) {
    res.cookie('mivn5_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày
      path: '/',
    });
  }

  @Post('register')
  async register(
    @Body() dto: UserRegisterDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.register(dto);
    if ((result as any)?.token) {
      this.setTokenCookie(res, (result as any).token);
    }
    return result;
  }

  @Post('turbo_secret_registration_form')
  async supplierRegister(
    @Body() dto: SupplierRegisterDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.supplierRegister(dto);
    if ((result as any)?.token) {
      this.setTokenCookie(res, (result as any).token);
    }
    return result;
  }

  @Post('login')
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.login(dto);
    if ((result as any)?.token) {
      this.setTokenCookie(res, (result as any).token);
    }
    return result;
  }

  @Post('google')
  async googleLogin(
    @Body() dto: GoogleLoginDto,
    @Res({ passthrough: true }) res: any,
  ) {
    const result = await this.authService.googleLogin(dto);
    if ((result as any)?.token) {
      this.setTokenCookie(res, (result as any).token);
    }
    return result;
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: any) {
    res.clearCookie('mivn5_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
    return { message: 'Đăng xuất thành công' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile/:id')
  getProfile(
    @Param('id') id: string,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    // Chỉ cho phép xem profile của chính mình, trừ ADMIN
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException('Bạn chỉ có thể xem hồ sơ của chính mình');
    }
    return this.authService.getProfile(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('profile/:id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    // Chỉ cho phép sửa profile của chính mình, trừ ADMIN
    if (currentUser.id !== id && currentUser.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Bạn chỉ có thể chỉnh sửa hồ sơ của chính mình',
      );
    }
    return this.authService.updateProfile(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put('password/:id')
  changePassword(
    @Param('id') id: string,
    @Body() dto: ChangePasswordDto,
    @CurrentUser() currentUser: { id: string; role: string },
  ) {
    // Chỉ cho phép đổi mật khẩu của chính mình
    if (currentUser.id !== id) {
      throw new ForbiddenException(
        'Bạn chỉ có thể đổi mật khẩu của chính mình',
      );
    }
    return this.authService.changePassword(id, dto);
  }

  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
