import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * Beskriver de oplysninger, som gemmes i JWT payloadet.
 */
export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({

      // JWT-tokenet læses fra Authorization-headeren
      // som et Bearer token.
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      // Secret key anvendes til at validere tokenets signatur.
      secretOrKey: config.get<string>('JWT_SECRET') ?? 'dev-secret',
    });
  }

  /**
   * Kaldes automatisk når et JWT-token er blevet valideret.
   * Payloadet returneres og bliver tilgængeligt som request.user.
   */
  validate(payload: JwtPayload) {
    return payload;
  }
}