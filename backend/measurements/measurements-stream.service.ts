import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';
import { Measurement } from './measurement.entity';

@Injectable()
export class MeasurementsStreamService {
  private readonly streamKey = 'measurements:stream';

  // Redis Stream må cirka kun gemme de nyeste 100 events.
  // Det begrænser memory-forbruget, så streamen ikke vokser uendeligt.
  private readonly maxStreamLength = 100;

  constructor(private readonly redisService: RedisService) {}

  async addMeasurementCreatedEvent(measurement: Measurement) {
    const redis = this.redisService.getClient();

    // XADD skriver en ny event til Redis Stream.
    // MAXLEN ~ 100 betyder, at Redis cirka kun beholder de nyeste 100 events.
    // * betyder, at Redis selv opretter et unikt stream-id.
    await redis.xadd(
      this.streamKey,
      'MAXLEN',
      '~',
      this.maxStreamLength,
      '*',
      'event',
      'measurement.created',
      'measurementId',
      measurement.id.toString(),
      'temperature',
      measurement.temperature.toString(),
      'humidity',
      measurement.humidity.toString(),
      'radonShortTermAvg',
      measurement.radonShortTermAvg.toString(),
      'radonLongTermAvg',
      measurement.radonLongTermAvg.toString(),
      'createdAt',
      measurement.createdAt.toISOString(),
    );
  }

  async readLatestEvents(count = 10) {
    const redis = this.redisService.getClient();

    // XREVRANGE læser de nyeste events fra streamen.
    // + betyder start fra nyeste event.
    // - betyder læs bagud i streamen.
    return redis.xrevrange(this.streamKey, '+', '-', 'COUNT', count);
  }
}