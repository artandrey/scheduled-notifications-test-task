import { Nominal, Entity } from "src/shared/domain/entity";

export type NotificationId = Nominal<string, 'NotificationId'>;
export type UserId = Nominal<string, 'UserId'>;

export enum NotificationStatus {
  SCHEDULED = 'SCHEDULED',
  SENT = 'SENT',
  FAILED = 'FAILED',
}

export class Notification extends Entity<NotificationId> {
  private readonly _userId: UserId;
  private readonly _message: string;
  private readonly _scheduledAt: Date;
  private readonly _createdAt: Date;
  private _status: NotificationStatus;

  constructor(
    userId: UserId,
    message: string,
    scheduledAt: Date,
    status: NotificationStatus = NotificationStatus.SCHEDULED,
    id?: NotificationId,
    createdAt?: Date,
  ) {
    super(id);
    this._userId = userId;
    this._message = message;
    this._scheduledAt = scheduledAt;
    this._createdAt = createdAt || new Date();
    this._status = status;
  }

  get userId(): UserId {
    return this._userId;
  }

  get message(): string {
    return this._message;
  }

  get scheduledAt(): Date {
    return this._scheduledAt;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get status(): NotificationStatus {
    return this._status;
  }

  updateStatus(status: NotificationStatus): void {
    this._status = status;
  }

  static createWelcomeNotification(userId: UserId): Notification {
    const scheduledAt = new Date();
    scheduledAt.setHours(scheduledAt.getHours() + 24);

    return new Notification(
      userId,
      'Hello World',
      scheduledAt,
      NotificationStatus.SCHEDULED,
    );
  }
}
