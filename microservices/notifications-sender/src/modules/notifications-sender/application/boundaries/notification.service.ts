import { NotificationId, UserId } from '../../domain/entities/notification-delivery.entity';

export interface NotificationPayload {
  notificationId: NotificationId;
  userId: UserId;
  message: string;
  eventId: string;
}

export abstract class NotificationService {
  abstract sendNotification(payload: NotificationPayload): Promise<void>;
}
