import { TransactionHost } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { and, eq, lte } from 'drizzle-orm';

import {
  Notification,
  NotificationId,
  NotificationStatus,
  UserId,
} from 'src/modules/notifications-scheduler/domain/entities/notification.entity';
import { NotificationRepository } from 'src/modules/notifications-scheduler/domain/repositories/notification.repository';
import { scheduledNotifications } from 'src/shared/modules/persistence/infrastructure/drizzle/schema';
import { CjsDrizzleAdapter } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

import { DrizzleNotificationMapper } from '../mappers/drizzle-notification.mapper';

@Injectable()
export class DrizzleNotificationRepository extends NotificationRepository {
  constructor(
    private readonly _transactionHost: TransactionHost<CjsDrizzleAdapter>,
    private readonly _drizzleNotificationMapper: DrizzleNotificationMapper,
  ) {
    super();
  }

  async save(notification: Notification): Promise<NotificationId> {
    const persistence = this._drizzleNotificationMapper.toPersistence(notification);
    const [{ id }] = await this._transactionHost.tx.insert(scheduledNotifications).values(persistence).returning({
      id: scheduledNotifications.id,
    });

    return id as NotificationId;
  }

  async findById(id: NotificationId): Promise<Notification | null> {
    const result = await this._transactionHost.tx
      .select()
      .from(scheduledNotifications)
      .where(eq(scheduledNotifications.id, id))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    return this._drizzleNotificationMapper.toDomain(result[0]);
  }

  async findByUserId(userId: UserId): Promise<Notification[]> {
    const results = await this._transactionHost.tx
      .select()
      .from(scheduledNotifications)
      .where(eq(scheduledNotifications.userId, userId));

    return results.map((result) => this._drizzleNotificationMapper.toDomain(result));
  }

  async updateStatus(id: NotificationId, status: NotificationStatus): Promise<void> {
    await this._transactionHost.tx
      .update(scheduledNotifications)
      .set({ status })
      .where(eq(scheduledNotifications.id, id));
  }

  async findByScheduledAtBeforeAndStatus(
    date: Date,
    status: NotificationStatus,
    limit: number,
  ): Promise<Notification[]> {
    const results = await this._transactionHost.tx
      .select()
      .from(scheduledNotifications)
      .where(and(lte(scheduledNotifications.scheduledAt, date), eq(scheduledNotifications.status, status)))
      .limit(limit)
      .orderBy(scheduledNotifications.scheduledAt);

    return results.map((result) => this._drizzleNotificationMapper.toDomain(result));
  }

  async findByScheduledAtBefore(date: Date): Promise<Notification[]> {
    const results = await this._transactionHost.tx
      .select()
      .from(scheduledNotifications)
      .where(lte(scheduledNotifications.scheduledAt, date));

    return results.map((result) => this._drizzleNotificationMapper.toDomain(result));
  }

  async deleteByScheduledAtBeforeAndStatus(date: Date, status: NotificationStatus): Promise<number> {
    const result = await this._transactionHost.tx
      .delete(scheduledNotifications)
      .where(and(lte(scheduledNotifications.scheduledAt, date), eq(scheduledNotifications.status, status)));

    return result.rowCount || 0;
  }
}
