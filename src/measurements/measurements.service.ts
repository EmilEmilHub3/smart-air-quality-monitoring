import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { Measurement } from './measurement.entity';
import { MeasurementsGateway } from './measurements.gateway';

@Injectable()
export class MeasurementsService {
  constructor(
    @InjectRepository(Measurement)
    private readonly measurements: Repository<Measurement>,
    private readonly gateway: MeasurementsGateway,
  ) {}

  async create(dto: CreateMeasurementDto) {
    const measurement = this.measurements.create(dto);
    const saved = await this.measurements.save(measurement);

    this.gateway.sendNewMeasurement(saved);

    return saved;
  }

  findAll() {
    return this.measurements.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findLatest() {
    const latest = await this.measurements.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    if (!latest) {
      throw new NotFoundException('No measurements found');
    }

    return latest;
  }

  async deleteAll() {
    await this.measurements.clear();
    return { deleted: true };
  }
}
