import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  // PUBLIC: Bất cứ ai cũng có thể gửi form liên hệ
  @Post()
  async submit(
    @Body()
    body: {
      fullName: string;
      email: string;
      subject: string;
      message: string;
    },
  ) {
    return this.contactService.create(body);
  }

  // PROTECTED: Chỉ ADMIN mới xem được danh sách liên hệ
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.contactService.findAll();
  }

  // PROTECTED: Đánh dấu đã đọc / chưa đọc
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Body() body: { isRead: boolean }) {
    return this.contactService.markAsRead(id, body.isRead);
  }

  // PROTECTED: Xóa liên hệ
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.contactService.delete(id);
  }
}
