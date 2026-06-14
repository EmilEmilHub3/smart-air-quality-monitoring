import { Controller, Get, Header } from '@nestjs/common';
import { MetricsService } from './metrics.service';

/**
 * Endpoint som Prometheus bruger til at hente metrics.
 *
 * Når Prometheus scraper /metrics, returneres alle registrerede
 * metrics i et format som Prometheus kan forstå.
 */
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metricsService: MetricsService) {}

  /**
   * Returnerer alle metrics som tekst.
   *
   * Eksempel:
   * http_requests_total
   * http_request_duration_seconds
   * nodejs memory metrics osv.
   */
  @Get()
  @Header('Content-Type', 'text/plain')
  async getMetrics(): Promise<string> {
    return this.metricsService.getMetrics();
  }
}