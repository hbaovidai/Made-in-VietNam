import { Controller, Post, Body, Get, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto, UpdateProfileDto, ChangePasswordDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.authService.getProfile(id);
  }

  @Put('profile/:id')
  updateProfile(@Param('id') id: string, @Body() dto: UpdateProfileDto) {
    return this.authService.updateProfile(id, dto);
  }

  @Put('password/:id')
  changePassword(@Param('id') id: string, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(id, dto);
  }
}
