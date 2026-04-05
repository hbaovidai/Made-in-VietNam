import { Controller, Get, Put, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { SuppliersService } from './suppliers.service';
import { UpdateSupplierDto, SupplierQueryDto } from './dto/supplier.dto';

@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  findAll(@Query() query: SupplierQueryDto) {
    return this.suppliersService.findAll(query);
  }

  @Get(':slug')
  findBySlug(@Param('slug') slug: string) {
    return this.suppliersService.findBySlug(slug);
  }

  // Tạm nhận supplierId từ body (JWT thay thế sau)
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateSupplierDto) {
    return this.suppliersService.update(id, dto);
  }

  @Post(':id/certifications')
  addCertification(
    @Param('id') id: string,
    @Body() body: { name: string; issuedBy?: string; documentUrl?: string },
  ) {
    return this.suppliersService.addCertification(id, body);
  }

  @Delete(':supplierId/certifications/:certId')
  deleteCertification(
    @Param('supplierId') supplierId: string,
    @Param('certId') certId: string,
  ) {
    return this.suppliersService.deleteCertification(certId, supplierId);
  }
}
