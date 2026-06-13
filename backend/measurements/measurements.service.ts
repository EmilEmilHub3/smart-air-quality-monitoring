import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { Measurement } from './measurement.entity';
import { MeasurementsGateway } from './measurements.gateway';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MeasurementsService {
  private readonly latestMeasurementCacheKey = 'measurements:latest';

  constructor(
    @InjectRepository(Measurement)
    private readonly measurements: Repository<Measurement>,

    private readonly gateway: MeasurementsGateway,

    private readonly redisService: RedisService,

    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateMeasurementDto) {
    const measurement = this.measurements.create(dto);
    const saved = await this.measurements.save(measurement);

    // Når en ny måling oprettes, sletter vi cachen.
    // Det gør vi fordi den gamle cached measurement ikke længere er den nyeste.
    await this.deleteLatestMeasurementCache();

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
    const redis = this.redisService.getClient();

    // 1. Først prøver vi at hente den nyeste måling fra Redis.
    const cachedMeasurement = await redis.get(this.latestMeasurementCacheKey);

    if (cachedMeasurement) {
      // Cache hit: data fandtes i Redis, så databasen skal ikke kaldes.
      return {
        source: 'redis-cache',
        data: JSON.parse(cachedMeasurement),
      };
    }

    // Cache miss: data fandtes ikke i Redis, så vi henter fra MySQL.
    const latest = await this.measurements.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    if (!latest) {
      throw new NotFoundException('No measurements found');
    }

    // 2. Når data er hentet fra MySQL, gemmes det i Redis.
    await this.saveLatestMeasurementInCache(latest);

    return {
      source: 'mysql-database',
      data: latest,
    };
  }

  async deleteAll() {
    await this.measurements.clear();

    // Når alle målinger slettes, skal Redis-cachen også slettes.
    await this.deleteLatestMeasurementCache();

    return { deleted: true };
  }

  private async saveLatestMeasurementInCache(measurement: Measurement) {
    const redis = this.redisService.getClient();

    const ttlSeconds = Number(
      this.config.get<string>('MEASUREMENTS_CACHE_TTL_SECONDS', '60'),
    );

    // SET gemmer data i Redis.
    // EX betyder expiration time i sekunder.
    // Efter ttlSeconds slettes værdien automatisk fra Redis.
    await redis.set(
      this.latestMeasurementCacheKey,
      JSON.stringify(measurement),
      'EX',
      ttlSeconds,
    );
  }

  private async deleteLatestMeasurementCache() {
    const redis = this.redisService.getClient();

    // DEL fjerner cache-key fra Redis.
    await redis.del(this.latestMeasurementCacheKey);
  }
}