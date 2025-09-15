import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';

import { OutboxMessage, OutboxPublisher } from 'src/shared/application/boundaries/outbox.publisher';
import { outboxMessages } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

import { DrizzleOutboxMessageMapper } from '../mappers/drizzle-outbox-message.mapper';

@Injectable()
export class DrizzleOutboxPublisher extends OutboxPublisher {
  constructor(
    private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>,
    private readonly _drizzleOutboxMessageMapper: DrizzleOutboxMessageMapper,
  ) {
    super();
  }

  async publish(event: OutboxMessage): Promise<void> {
    await this._transactionHost.tx
      .insert(outboxMessages)
      .values(this._drizzleOutboxMessageMapper.toPersistence(event))
      .execute();
  }
}
