import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Measurement } from './measurement.entity';
import { MeasurementsController } from './measurements.controller';
import { MeasurementsGateway } from './measurements.gateway';
import { MeasurementsService } from './measurements.service';
import { PiApiKeyGuard } from './pi-api-key.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Measurement])],
  controllers: [MeasurementsController],
  providers: [MeasurementsService, MeasurementsGateway, PiApiKeyGuard],
})
export class MeasurementsModule {}
