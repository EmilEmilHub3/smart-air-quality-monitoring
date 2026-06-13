import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly client: Redis;

  constructor(private readonly config: ConfigService) {
    // Opretter forbindelse til Redis-serveren.
    // Værdierne kommer fra .env-filen.
    this.client = new Redis({
      host: this.config.get<string>('REDIS_HOST', 'localhost'),
      port: Number(this.config.get<string>('REDIS_PORT', '6379')),
    });
  }

  // Giver andre services adgang til Redis-klienten.
  getClient(): Redis {
    return this.client;
  }

  // Lukker Redis-forbindelsen pænt, når NestJS lukker ned.
  async onModuleDestroy() {
    await this.client.quit();
  }
}