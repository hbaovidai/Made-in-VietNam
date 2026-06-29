import { Controller, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { JsonStorageService } from './json-storage.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

// Allowed collections (whitelist to prevent arbitrary file access)
const ALLOWED_COLLECTIONS = [
  'about',
  'blog-posts',
  'blog-categories',
  'blog-settings',
  'careers',
];

@Controller('json-storage')
export class JsonStorageController {
  constructor(private readonly storage: JsonStorageService) {}

  @Get(':collection')
  read(@Param('collection') collection: string) {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return { error: 'Collection not allowed' };
    }
    return this.storage.read(collection, null);
  }

  @Put(':collection')
  @UseGuards(JwtAuthGuard)
  write(@Param('collection') collection: string, @Body() data: any) {
    if (!ALLOWED_COLLECTIONS.includes(collection)) {
      return { error: 'Collection not allowed' };
    }
    this.storage.write(collection, data);
    return { success: true };
  }
}
