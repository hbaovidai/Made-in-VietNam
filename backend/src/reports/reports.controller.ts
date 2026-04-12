import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get()
  getReports() {
    return this.reportsService.getReports();
  }

  @Get(':id')
  getReportById(@Param('id') id: string) {
    return this.reportsService.getReportById(id);
  }
}
