import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ProductQueryDto } from './dto/product.dto';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.productsService.findBySlug(slug);
  }

  @Get(':id/related')
  findRelated(@Param('id') id: string) {
    return this.productsService.findRelated(id);
  }

  // Tạm thời nhận supplierId từ body (JWT sẽ thay thế sau)
  @Post()
  create(@Body() body: CreateProductDto & { supplierId: string }) {
    const { supplierId, ...dto } = body;
    return this.productsService.create(supplierId, dto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto & { supplierId: string },
  ) {
    const { supplierId, ...dto } = body;
    return this.productsService.update(id, supplierId, dto);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @Body('supplierId') supplierId: string) {
    return this.productsService.delete(id, supplierId);
  }
}
