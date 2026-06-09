import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async onModuleInit() {
    const existing = await this.users.findOne({ where: { email: 'admin@test.dk' } });
    if (!existing) {
      await this.users.save({
        email: 'admin@test.dk',
        passwordHash: await bcrypt.hash('password', 10),
        role: UserRole.Admin,
      });
    }
  }

  findByEmail(email: string) {
    return this.users.findOne({ where: { email } });
  }
}
