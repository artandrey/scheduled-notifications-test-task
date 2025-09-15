import { UserId } from "../../domain/entities/notification.entity";

export type UserCreatedEventPayload = {
  userId: UserId;
  name: string;
  eventId: string;
};

export class UserCreatedEvent {
  constructor(
    public readonly payload: UserCreatedEventPayload,
  ) {}

  static fromPayload(payload: UserCreatedEventPayload): UserCreatedEvent {
    return new UserCreatedEvent(payload);
  }

  get userId(): UserId {
    return this.payload.userId;
  }

  get name(): string {
    return this.payload.name;
  }

  get eventId(): string {
    return this.payload.eventId;
  }
}
