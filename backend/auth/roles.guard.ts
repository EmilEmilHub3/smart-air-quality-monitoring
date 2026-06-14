import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  /**
   * Kontrollerer om den autentificerede bruger
   * har en af de roller, der kræves af endpointet.
   */
  canActivate(context: ExecutionContext): boolean {

    // Henter de roller der er angivet med @Roles(...)
    // på controlleren eller endpointet.
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Hvis endpointet ikke kræver roller,
    // gives der adgang.
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();

    // request.user kommer fra JwtStrategy,
    // som har valideret JWT-tokenet.
    const user = request.user;

    // Brugeren får kun adgang hvis vedkommendes
    // rolle findes blandt de tilladte roller.
    return requiredRoles.includes(user?.role);
  }
}