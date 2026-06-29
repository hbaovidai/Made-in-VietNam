import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { LegalService } from './legal.service';
import { CreateLegalSectionDto, UpdateLegalSectionDto } from './legal.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('legal-sections')
export class LegalController {
  constructor(private readonly legalService: LegalService) {}

  // PUBLIC: Get active legal sections
  @Get()
  async findActive(@Query('pageKey') pageKey: string = 'terms') {
    return this.legalService.findActive(pageKey);
  }

  // ADMIN: Get all legal sections (including inactive)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin')
  async findAll(@Query('pageKey') pageKey: string = 'terms') {
    return this.legalService.findAll(pageKey);
  }

  // ADMIN: Get single legal section details
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.legalService.findOne(id);
  }

  // ADMIN: Create legal section
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateLegalSectionDto) {
    return this.legalService.create(dto);
  }

  // ADMIN: Update legal section
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateLegalSectionDto) {
    return this.legalService.update(id, dto);
  }

  // ADMIN: Move sort order
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/move')
  async move(
    @Param('id') id: string,
    @Body('direction') direction: 'up' | 'down',
  ) {
    return this.legalService.move(id, direction);
  }

  // ADMIN: Delete legal section
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.legalService.delete(id);
  }
}
