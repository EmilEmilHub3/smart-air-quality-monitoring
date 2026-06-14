import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Validerer brugerens login-oplysninger og udsteder
   * et JWT access token ved succesfuld autentifikation.
   */
  async login(email: string, password: string) {

    // Finder brugeren ud fra email-adressen.
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid login');
    }

    // Sammenligner det indtastede password med det gemte hash.
    const validPassword = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new UnauthorizedException('Invalid login');
    }

    // JWT payload indeholder brugerens identitet og rolle.
    // Payloadet bruges senere til authorization.
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}