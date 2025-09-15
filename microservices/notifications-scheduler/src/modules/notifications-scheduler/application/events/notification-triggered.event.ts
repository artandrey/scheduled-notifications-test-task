import { NotificationId, UserId } from '../../domain/entities/notification.entity';

export type NotificationTriggeredEventPayload = {
  notificationId: NotificationId;
  userId: UserId;
  message: string;
  eventId: string;
};

export class NotificationTriggeredEvent {
  constructor(public readonly payload: NotificationTriggeredEventPayload) {}

  static fromNotification(notificationId: NotificationId, userId: UserId, message: string): NotificationTriggeredEvent {
    return new NotificationTriggeredEvent({
      notificationId,
      userId,
      message,
      eventId: crypto.randomUUID(),
    });
  }

  get notificationId(): NotificationId {
    return this.payload.notificationId;
  }

  get userId(): UserId {
    return this.payload.userId;
  }

  get message(): string {
    return this.payload.message;
  }

  get eventId(): string {
    return this.payload.eventId;
  }
}
