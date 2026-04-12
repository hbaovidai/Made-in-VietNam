import { Controller, Post, Body, Get } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post()
  async submit(@Body() body: { fullName: string; email: string; subject: string; message: string }) {
    return this.contactService.create(body);
  }

  @Get()
  async findAll() {
    return this.contactService.findAll();
  }
}
