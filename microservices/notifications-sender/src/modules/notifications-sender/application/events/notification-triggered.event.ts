import { EventId, NotificationId, UserId } from '../../domain/entities/notification-delivery.entity';

export interface NotificationTriggeredEventPayload {
  notificationId: NotificationId;
  userId: UserId;
  message: string;
  eventId: EventId;
};

export class NotificationTriggeredEvent {
  constructor(
    public readonly payload: NotificationTriggeredEventPayload,
  ) {}

  static fromPayload(payload: NotificationTriggeredEventPayload): NotificationTriggeredEvent {
    return new NotificationTriggeredEvent(payload);
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

  get eventId(): EventId {
    return this.payload.eventId;
  }
}
