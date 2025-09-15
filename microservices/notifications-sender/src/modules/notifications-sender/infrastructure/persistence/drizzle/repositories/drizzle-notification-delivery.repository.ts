import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';


import { DrizzleNotificationDeliveryMapper } from '../mappers/drizzle-notification-delivery.mapper';
import { NotificationDelivery, NotificationDeliveryId, EventId } from 'src/modules/notifications-sender/domain/entities/notification-delivery.entity';
import { NotificationDeliveryRepository } from 'src/modules/notifications-sender/domain/repositories/notification-delivery.repository';
import { notificationDeliveries } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

@Injectable()
export class DrizzleNotificationDeliveryRepository extends NotificationDeliveryRepository {
  constructor(
    private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>,
    private readonly _mapper: DrizzleNotificationDeliveryMapper,
  ) {
    super();
  }

  async save(delivery: NotificationDelivery): Promise<NotificationDeliveryId> {
    const persistence = this._mapper.toPersistence(delivery);

    const [{ id }] = await this._transactionHost.tx
      .insert(notificationDeliveries)
      .values(persistence)
      .returning({ id: notificationDeliveries.id });

    return id as NotificationDeliveryId;
  }

  async findByEventId(eventId: EventId): Promise<NotificationDelivery | null> {
    const result = await this._transactionHost.tx
      .select()
      .from(notificationDeliveries)
      .where(eq(notificationDeliveries.eventId, eventId))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this._mapper.toDomain(result[0]);
  }

  async update(delivery: NotificationDelivery): Promise<void> {
    const persistence = this._mapper.toPersistence(delivery);

    await this._transactionHost.tx
      .update(notificationDeliveries)
      .set({
        status: persistence.status,
        attempts: persistence.attempts,
        lastAttemptAt: persistence.lastAttemptAt,
        deliveredAt: persistence.deliveredAt,
        errorMessage: persistence.errorMessage,
      })
      .where(eq(notificationDeliveries.id, delivery.id));
  }

  async findById(id: NotificationDeliveryId): Promise<NotificationDelivery | null> {
    const result = await this._transactionHost.tx
      .select()
      .from(notificationDeliveries)
      .where(eq(notificationDeliveries.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this._mapper.toDomain(result[0]);
  }

  async existsByEventId(eventId: EventId): Promise<boolean> {
    const result = await this._transactionHost.tx
      .select({ id: notificationDeliveries.id })
      .from(notificationDeliveries)
      .where(eq(notificationDeliveries.eventId, eventId))
      .limit(1);

    return result.length > 0;
  }
}
