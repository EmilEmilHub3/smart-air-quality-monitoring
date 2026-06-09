import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PiApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const providedKey = request.headers['x-api-key'];
    const expectedKey = this.config.get<string>('PI_API_KEY');

    if (!expectedKey || providedKey !== expectedKey) {
      throw new UnauthorizedException('Invalid Raspberry Pi API key');
    }

    return true;
  }
}
