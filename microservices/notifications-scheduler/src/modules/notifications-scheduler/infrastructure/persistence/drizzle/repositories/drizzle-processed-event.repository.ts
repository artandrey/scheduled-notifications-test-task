import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';

import { processedEvents } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter, DrizzleProcessedEvent } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

export type EventId = string;

@Injectable()
export class DrizzleProcessedEventRepository {
  constructor(private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>) {}

  async save(eventId: EventId): Promise<string> {
    const [{ id }] = await this._transactionHost.tx
      .insert(processedEvents)
      .values({
        eventId,
      })
      .returning({
        id: processedEvents.id,
      });

    return id;
  }

  async findByEventId(eventId: EventId): Promise<DrizzleProcessedEvent | null> {
    const result = await this._transactionHost.tx
      .select()
      .from(processedEvents)
      .where(eq(processedEvents.eventId, eventId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  }

  async existsByEventId(eventId: EventId): Promise<boolean> {
    const result = await this._transactionHost.tx
      .select({ id: processedEvents.id })
      .from(processedEvents)
      .where(eq(processedEvents.eventId, eventId))
      .limit(1);

    return result.length > 0;
  }
}
