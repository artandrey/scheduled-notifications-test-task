import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { asc, inArray, isNull } from 'drizzle-orm';

import { outboxMessages } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

import { RabbitMqEventPublisher } from '../rabbitmq/rabbit-mq-event-publisher';

@Injectable()
export class DrizzleRabbitMqOutboxProcessor {
  private readonly _outboxPublisherBatchSize: number = 1000;
  private readonly _publishedMessagesIds: string[] = [];
  private readonly _logger = new Logger(DrizzleRabbitMqOutboxProcessor.name);

  constructor(
    private readonly _configService: ConfigService,
    private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>,
    private readonly _rabbitMqEventPublisher: RabbitMqEventPublisher,
  ) {
    this._outboxPublisherBatchSize = this._configService.getOrThrow('OUTBOX_PROCESSOR_BATCH_SIZE');
  }

  @Cron(CronExpression.EVERY_SECOND)
  async process() {
    const messages = await this._transactionHost.tx
      .select({
        id: outboxMessages.id,
        eventType: outboxMessages.eventType,
        eventData: outboxMessages.eventData,
      })
      .from(outboxMessages)
      .where(isNull(outboxMessages.processedAt))
      .orderBy(asc(outboxMessages.createdAt))
      .limit(this._outboxPublisherBatchSize)
      .for('update', { skipLocked: true });

    await Promise.all(
      messages.map(async (message) => {
        await this._rabbitMqEventPublisher.publishEvent(message.eventType, message.eventData);
        this._publishedMessagesIds.push(message.id);
      }),
    );

    await this.notifyPublishedMessages();
  }

  private async notifyPublishedMessages() {
    if (this._publishedMessagesIds.length === 0) {
      return;
    }

    await this._transactionHost.tx
      .update(outboxMessages)
      .set({ processedAt: new Date() })
      .where(inArray(outboxMessages.id, this._publishedMessagesIds));

    this._publishedMessagesIds.length = 0;
  }
}
