import { Notification, NotificationId, NotificationStatus, UserId } from '../entities/notification.entity';

export abstract class NotificationRepository {
  abstract save(notification: Notification): Promise<NotificationId>;
  abstract findById(id: NotificationId): Promise<Notification | null>;
  abstract findByUserId(userId: UserId): Promise<Notification[]>;
  abstract updateStatus(id: NotificationId, status: NotificationStatus): Promise<void>;
  abstract findByScheduledAtBeforeAndStatus(
    date: Date,
    status: NotificationStatus,
    limit: number,
  ): Promise<Notification[]>;
  abstract findByScheduledAtBefore(date: Date): Promise<Notification[]>;
  abstract deleteByScheduledAtBeforeAndStatus(date: Date, status: NotificationStatus): Promise<number>;
}
