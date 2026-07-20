import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  // PROTECTED: Buyer/User submit a product review
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Req() req: any,
    @Body()
    body: {
      productId: string;
      rating: number;
      content: string;
      images?: string[];
    },
  ) {
    return this.reviewsService.create(req.user.id, body);
  }

  // PUBLIC: Get approved reviews for a specific product
  @Get('product/:productId')
  async getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  // PROTECTED: Admin fetches all reviews
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  async findAll() {
    return this.reviewsService.findAll();
  }

  // PROTECTED: Admin updates review status (Approve/Reject)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.reviewsService.updateStatus(id, body.status);
  }

  // PROTECTED: Admin deletes a review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.reviewsService.delete(id);
  }

  // PUBLIC: Mark review as helpful
  @Patch(':id/helpful')
  async incrementHelpful(@Param('id') id: string) {
    return this.reviewsService.incrementHelpful(id);
  }

  // PROTECTED: Admin/Seller reply to a review
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch(':id/reply')
  async addSellerReply(
    @Param('id') id: string,
    @Body() body: { reply: string },
  ) {
    return this.reviewsService.addSellerReply(id, body.reply);
  }
}
