import {
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { MetricsController } from './metrics.controller';
import { MetricsMiddleware } from './metrics.middleware';
import { MetricsService } from './metrics.service';

/**
 * Monitoring-modulet samler alle Prometheus-komponenter.
 *
 * Modulet består af:
 * - Controller til /metrics endpoint
 * - Service til metrics
 * - Middleware som måler requests
 */
@Module({
  controllers: [MetricsController],
  providers: [MetricsService],
})
export class MonitoringModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    /**
     * Aktiverer MetricsMiddleware på alle routes.
     *
     * Dermed måles alle HTTP requests automatisk.
     */
    consumer.apply(MetricsMiddleware).forRoutes('*');
  }
}