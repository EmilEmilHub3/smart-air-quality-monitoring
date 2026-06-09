import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
export declare class UsersService implements OnModuleInit {
    private readonly users;
    constructor(users: Repository<User>);
    onModuleInit(): Promise<void>;
    findByEmail(email: string): Promise<User>;
}
