import { Injectable } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from 'prom-client';

/**
 * Service som opretter og vedligeholder Prometheus metrics.
 */
@Injectable()
export class MetricsService {
  private readonly httpRequestCounter: Counter<string>;
  private readonly httpRequestDuration: Histogram<string>;

  constructor() {
    /**
     * Indsamler standard Node.js metrics.
     *
     * Eksempler:
     * - CPU-forbrug
     * - Memory-forbrug
     * - Event Loop statistik
     * - Garbage Collection statistik
     */
    collectDefaultMetrics();

    /**
     * Counter bruges til at tælle hvor mange requests
     * systemet modtager.
     *
     * Bruges til Golden Signal:
     * Traffic
     */
    this.httpRequestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });

    /**
     * Histogram bruges til at måle responstider.
     *
     * Buckets opdeler responstider i intervaller,
     * som Prometheus kan analysere.
     *
     * Bruges til Golden Signal:
     * Latency
     */
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
    });
  }

  /**
   * Registrerer en HTTP request.
   */
  recordHttpRequest(
    method: string,
    route: string,
    statusCode: number,
    durationSeconds: number,
  ) {
    const labels = {
      method,
      route,
      status_code: statusCode.toString(),
    };

    // Øger request-tælleren med 1
    this.httpRequestCounter.inc(labels);

    // Registrerer responstiden
    this.httpRequestDuration.observe(labels, durationSeconds);
  }

  /**
   * Returnerer alle metrics til Prometheus.
   */
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  /**
   * Returnerer korrekt content-type til Prometheus.
   */
  getContentType(): string {
    return register.contentType;
  }
}