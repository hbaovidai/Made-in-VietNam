import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
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
} from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: UserRegisterDto) {
    return this.authService.register(dto);
  }

  @Post('turbo_secret_registration_form')
  supplierRegister(@Body() dto: SupplierRegisterDto) {
    return this.authService.supplierRegister(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('google')
  googleLogin(@Body() dto: GoogleLoginDto) {
    return this.authService.googleLogin(dto);
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
}
