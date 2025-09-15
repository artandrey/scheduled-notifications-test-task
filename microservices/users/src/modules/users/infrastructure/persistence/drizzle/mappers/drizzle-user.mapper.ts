import { Injectable } from '@nestjs/common';

import { User, UserId } from 'src/modules/users/domain/entities/user.entity';
import { DrizzleUser } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

@Injectable()
export class DrizzleUserMapper {
  toDomain(persistence: DrizzleUser): User {
    return new User(persistence.name, persistence.id as UserId);
  }

  toPersistence(domain: User): DrizzleUser {
    return {
      id: domain.id,
      name: domain.name,
    };
  }
}
