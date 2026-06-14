import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { MetricsService } from './metrics.service';

/**
 * Middleware som måler alle HTTP requests.
 *
 * Klassen registrerer:
 * - HTTP metode (GET, POST, DELETE osv.)
 * - Route
 * - Statuskode
 * - Responstid
 *
 * Disse data sendes videre til MetricsService,
 * som gemmer dem som Prometheus metrics.
 */
@Injectable()
export class MetricsMiddleware implements NestMiddleware {
  constructor(private readonly metricsService: MetricsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    // Gem starttidspunktet for requesten
    const startTime = Date.now();

    // Kører når requesten er færdigbehandlet
    res.on('finish', () => {
      // Beregn responstid i sekunder
      const durationSeconds = (Date.now() - startTime) / 1000;

      // Registrer metrics
      this.metricsService.recordHttpRequest(
        req.method,                    // GET, POST osv.
        req.route?.path ?? req.path,   // Endpoint
        res.statusCode,                // HTTP statuskode
        durationSeconds,               // Responstid
      );
    });

    // Fortsæt request pipeline
    next();
  }
}