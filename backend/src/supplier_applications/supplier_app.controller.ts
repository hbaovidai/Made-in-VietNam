import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ForbiddenException,
  ParseIntPipe,
  Patch,
  ParseEnumPipe,
} from '@nestjs/common';
import { SupplierApplicationService } from './supplier_app.service';
import { SupplierApplicationDto } from './dto/supplier_app.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { SupplierApplicationStatus } from './supplier_app.service';

@Controller('supp_apps')
export class SupplierApplicationController {
  constructor(private readonly suppAppService: SupplierApplicationService) {}

  // Protected: Chỉ cho phép admin xem
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('/supp_apps_all')
  async getAllApplications(@Body() query: SupplierApplicationDto) {
    return this.suppAppService.findAll(query);
  }

  // Protected: Chỉ cho phép admin xoá
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('/:id')
  async deleteApplication(@Param('id', ParseIntPipe) id: number) {
    const result: any = await this.suppAppService.deleteApplication(id);
    return result;
  }

  // Protected: Chỉ cho phép admin update status
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('/:id/:newStatus')
  async updateApplicationStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('newStatus', new ParseEnumPipe(SupplierApplicationStatus))
    newStatus: SupplierApplicationStatus,
  ) {
    const result: any = await this.suppAppService.updateApplicationStatus(
      id,
      newStatus,
    );
    return result;
  }
}
