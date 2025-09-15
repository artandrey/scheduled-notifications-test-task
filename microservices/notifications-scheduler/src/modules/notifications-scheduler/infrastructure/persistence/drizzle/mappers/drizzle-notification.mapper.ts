import { Injectable } from '@nestjs/common';

import { Notification, NotificationId, NotificationStatus, UserId } from 'src/modules/notifications-scheduler/domain/entities/notification.entity';
import { DrizzleScheduledNotification } from 'src/shared/modules/persistence/infrastructure/drizzle/types';

@Injectable()
export class DrizzleNotificationMapper {
  toDomain(persistence: DrizzleScheduledNotification): Notification {
    return new Notification(
      persistence.userId as UserId,
      persistence.message,
      persistence.scheduledAt,
      persistence.status as NotificationStatus,
      persistence.id as NotificationId,
      persistence.createdAt,
    );
  }

  toPersistence(domain: Notification): DrizzleScheduledNotification {
    return {
      id: domain.id,
      userId: domain.userId,
      message: domain.message,
      scheduledAt: domain.scheduledAt,
      createdAt: domain.createdAt,
      status: domain.status,
    };
  }
}
