import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { MeasurementsService } from './measurements.service';
import { PiApiKeyGuard } from './pi-api-key.guard';

@ApiTags('measurements')
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurementsService: MeasurementsService) {}

  @Post()
  @ApiSecurity('pi-api-key')
  @UseGuards(PiApiKeyGuard)
  create(@Body() dto: CreateMeasurementDto) {
    return this.measurementsService.create(dto);
  }

  @Get()
  findAll() {
    return this.measurementsService.findAll();
  }

  @Get('latest')
  findLatest() {
    return this.measurementsService.findLatest();
  }

  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteAll() {
    return this.measurementsService.deleteAll();
  }
}
