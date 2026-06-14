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

  /**
   * Opretter en ny måling.
   * Endpointet benyttes af Raspberry Pi'en og beskyttes
   * med en API-key for at sikre, at kun autoriserede enheder
   * kan indsende målinger.
   */
  @Post()
  @ApiSecurity('pi-api-key')
  @UseGuards(PiApiKeyGuard)
  create(@Body() dto: CreateMeasurementDto) {
    return this.measurementsService.create(dto);
  }

  /**
   * Returnerer de seneste målinger.
   */
  @Get()
  findAll() {
    return this.measurementsService.findAll();
  }

  /**
   * Returnerer den nyeste måling.
   * Endpointet anvender Cache-Aside pattern via Redis.
   */
  @Get('latest')
  findLatest() {
    return this.measurementsService.findLatest();
  }

  /**
   * Returnerer de seneste events fra Redis Stream.
   * Anvendes til demonstration af event-baseret arkitektur
   * og Redis Streams.
   */
  @Get('stream')
  findLatestStreamEvents() {
    return this.measurementsService.findLatestStreamEvents();
  }

  /**
   * Sletter alle målinger.
   * Endpointet kræver et gyldigt JWT samt rollen 'admin'.
   */
  @Delete()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  deleteAll() {
    return this.measurementsService.deleteAll();
  }
}