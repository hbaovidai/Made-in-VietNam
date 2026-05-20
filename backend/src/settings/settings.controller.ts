import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  /** Public — anyone can read site settings (footer needs it) */
  @Get()
  async getAll() {
    return this.settingsService.getAll();
  }

  /** Admin only — update settings */
  @Put()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  async update(@Body() body: Record<string, string>) {
    return this.settingsService.updateMany(body);
  }
}
