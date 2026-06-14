import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
/**
 * JWT-baseret authentication guard.
 * Validerer brugerens Bearer token ved hjælp af JwtStrategy,
 * før endpointet får lov til at blive udført.
 */
export class JwtAuthGuard extends AuthGuard('jwt') {}