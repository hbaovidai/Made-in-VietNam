import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id/saved')
  getSavedProducts(@Param('id') id: string) {
    return this.usersService.getSavedProducts(id);
  }

  @Post(':id/saved')
  saveProduct(@Param('id') id: string, @Body('productId') productId: string) {
    return this.usersService.saveProduct(id, productId);
  }

  @Delete(':id/saved/:productId')
  unsaveProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.usersService.unsaveProduct(id, productId);
  }

  @Delete(':id/saved')
  clearSavedProducts(@Param('id') id: string) {
    return this.usersService.clearSavedProducts(id);
  }

  @Get(':id/history')
  getViewHistory(@Param('id') id: string) {
    return this.usersService.getViewHistory(id);
  }

  @Post(':id/history')
  recordView(@Param('id') id: string, @Body('productId') productId: string) {
    return this.usersService.recordView(id, productId);
  }

  @Delete(':id/history/:historyId')
  deleteHistoryItem(@Param('id') id: string, @Param('historyId') historyId: string) {
    return this.usersService.deleteHistoryItem(id, historyId);
  }

  @Delete(':id/history')
  clearHistory(@Param('id') id: string) {
    return this.usersService.clearHistory(id);
  }
}
