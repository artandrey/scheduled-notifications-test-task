import { Injectable } from '@nestjs/common';
import { NotificationDelivery, DeliveryStatus, EventId, NotificationId, UserId, NotificationDeliveryId } from 'src/modules/notifications-sender/domain/entities/notification-delivery.entity';
import { DrizzleNotificationDelivery } from 'src/shared/modules/persistence/infrastructure/drizzle/types';


@Injectable()
export class DrizzleNotificationDeliveryMapper {
  toDomain(persistence: DrizzleNotificationDelivery): NotificationDelivery {
    return new NotificationDelivery(
      persistence.eventId as EventId,
      persistence.notificationId as NotificationId,
      persistence.userId as UserId,
      persistence.status as DeliveryStatus,
      persistence.attempts,
      persistence.id as NotificationDeliveryId,
      persistence.lastAttemptAt,
      persistence.deliveredAt,
      persistence.errorMessage,
      persistence.createdAt,
    );
  }

  toPersistence(domain: NotificationDelivery): Omit<DrizzleNotificationDelivery, 'id' | 'createdAt'> {
    return {
      eventId: domain.eventId,
      notificationId: domain.notificationId,
      userId: domain.userId,
      status: domain.status,
      attempts: domain.attempts,
      lastAttemptAt: domain.lastAttemptAt,
      deliveredAt: domain.deliveredAt,
      errorMessage: domain.errorMessage,
    };
  }
}
