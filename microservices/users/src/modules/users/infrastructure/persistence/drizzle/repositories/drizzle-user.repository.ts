import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { User, UserId } from 'src/modules/users/domain/entities/user.entity';
import { UserRepository } from 'src/modules/users/domain/repositories/user.repository';
import { users } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

import { DrizzleUserMapper } from '../mappers/drizzle-user.mapper';

@Injectable()
export class DrizzleUserRepository extends UserRepository {
  constructor(
    private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>,
    private readonly _drizzleUserMapper: DrizzleUserMapper,
  ) {
    super();
  }
  async save(user: User): Promise<UserId> {
    const persistence = this._drizzleUserMapper.toPersistence(user);
    const [{ id }] = await this._transactionHost.tx.insert(users).values(persistence).returning({
      id: users.id,
    });

    return id as UserId;
  }
}
