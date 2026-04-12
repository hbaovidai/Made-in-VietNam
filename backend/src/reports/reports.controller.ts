import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // PROTECTED: Chỉ ADMIN mới xem được báo cáo
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get()
  getReports() {
    return this.reportsService.getReports();
  }

  // PROTECTED: Chỉ ADMIN mới xem được chi tiết báo cáo
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get(':id')
  getReportById(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }
}
