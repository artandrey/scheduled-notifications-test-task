import { Module } from '@nestjs/common';

import { CreateUserCommandHandler } from './application/handlers/command/create-user.handler';
import { UserRepository } from './domain/repositories/user.repository';
import { UsersController } from './infrastructure/http/controllers/users.controller';
import { DrizzleUserMapper } from './infrastructure/persistence/drizzle/mappers/drizzle-user.mapper';
import { DrizzleUserRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-user.repository';

@Module({
  controllers: [UsersController],
  providers: [
    CreateUserCommandHandler,
    DrizzleUserMapper,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
})
export class UsersModule {}
