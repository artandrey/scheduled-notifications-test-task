import { Injectable } from '@nestjs/common';

import { OutboxMessage } from 'src/shared/application/boundaries/outbox.publisher';
import { DrizzleOutboxMessage } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

@Injectable()
export class DrizzleOutboxMessageMapper {
  toPersistence(event: OutboxMessage): DrizzleOutboxMessage {
    return {
      id: event.id,
      eventType: event.eventType,
      eventData: event.eventData,
      createdAt: event.createdAt,
      processedAt: event.processedAt,
    };
  }
}
