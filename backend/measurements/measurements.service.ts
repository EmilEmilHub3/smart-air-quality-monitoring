import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
import { Measurement } from './measurement.entity';
import { MeasurementsGateway } from './measurements.gateway';
import { MeasurementsStreamService } from './measurements-stream.service';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class MeasurementsService {

  /**
   * Redis cache-key for den seneste måling.
   * Anvendes af Cache-Aside pattern på /measurements/latest.
   */
  private readonly latestMeasurementCacheKey = 'measurements:latest';

  constructor(
    @InjectRepository(Measurement)
    private readonly measurements: Repository<Measurement>,

    private readonly gateway: MeasurementsGateway,

    private readonly redisService: RedisService,

    private readonly measurementsStreamService: MeasurementsStreamService,

    private readonly config: ConfigService,
  ) {}

  /**
   * Opretter en ny måling.
   *
   * Målingen gemmes i MySQL, cachen invalides,
   * målingen sendes til WebSocket-klienter og der
   * publiceres en event til Redis Stream.
   */
  async create(dto: CreateMeasurementDto) {
    const measurement = this.measurements.create(dto);
    const saved = await this.measurements.save(measurement);

    await this.deleteLatestMeasurementCache();

    this.gateway.sendNewMeasurement(saved);

    await this.measurementsStreamService.addMeasurementCreatedEvent(saved);

    return saved;
  }

  /**
   * Returnerer de 100 seneste målinger.
   */
  findAll() {
    return this.measurements.find({
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  /**
   * Returnerer den seneste måling ved hjælp af
   * Cache-Aside pattern.
   *
   * Data hentes først fra Redis. Ved cache miss
   * hentes målingen fra MySQL og gemmes efterfølgende i Redis.
   */
  async findLatest() {
    const redis = this.redisService.getClient();

    const cachedMeasurement = await redis.get(this.latestMeasurementCacheKey);

    if (cachedMeasurement) {
      return {
        source: 'redis-cache',
        data: JSON.parse(cachedMeasurement),
      };
    }

    const latest = await this.measurements.findOne({
      where: {},
      order: { createdAt: 'DESC' },
    });

    if (!latest) {
      throw new NotFoundException('No measurements found');
    }

    await this.saveLatestMeasurementInCache(latest);

    return {
      source: 'mysql-database',
      data: latest,
    };
  }

  /**
   * Returnerer de seneste events fra Redis Stream.
   * Anvendes til demonstration af event-baseret arkitektur.
   */
  async findLatestStreamEvents() {
    return this.measurementsStreamService.readLatestEvents(10);
  }

  /**
   * Sletter alle målinger og invaliderer den tilhørende cache.
   */
  async deleteAll() {
    await this.measurements.clear();

    await this.deleteLatestMeasurementCache();

    return { deleted: true };
  }

  /**
   * Gemmer den seneste måling i Redis med en TTL,
   * så cachen automatisk udløber efter et bestemt tidsrum.
   */
  private async saveLatestMeasurementInCache(measurement: Measurement) {
    const redis = this.redisService.getClient();

    const ttlSeconds = Number(
      this.config.get<string>('MEASUREMENTS_CACHE_TTL_SECONDS', '60'),
    );

    await redis.set(
      this.latestMeasurementCacheKey,
      JSON.stringify(measurement),
      'EX',
      ttlSeconds,
    );
  }

  /**
   * Fjerner den cached version af den seneste måling.
   * Kaldes når nye målinger oprettes eller data ændres.
   */
  private async deleteLatestMeasurementCache() {
    const redis = this.redisService.getClient();

    await redis.del(this.latestMeasurementCacheKey);
  }
}