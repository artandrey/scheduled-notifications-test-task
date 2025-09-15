import { Nominal, Entity } from "src/shared/domain/entity";

export type NotificationDeliveryId = Nominal<string, 'NotificationDeliveryId'>;
export type EventId = Nominal<string, 'EventId'>;
export type NotificationId = Nominal<string, 'NotificationId'>;
export type UserId = Nominal<string, 'UserId'>;

export enum DeliveryStatus {
  PENDING = 'PENDING',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

export class NotificationDelivery extends Entity<NotificationDeliveryId> {
  private readonly _eventId: EventId;
  private readonly _notificationId: NotificationId;
  private readonly _userId: UserId;
  private _status: DeliveryStatus;
  private _attempts: number;
  private _lastAttemptAt: Date | null;
  private _deliveredAt: Date | null;
  private _errorMessage: string | null;
  private readonly _createdAt: Date;

  constructor(
    eventId: EventId,
    notificationId: NotificationId,
    userId: UserId,
    status: DeliveryStatus = DeliveryStatus.PENDING,
    attempts: number = 0,
    id?: NotificationDeliveryId,
    lastAttemptAt: Date | null = null,
    deliveredAt: Date | null = null,
    errorMessage: string | null = null,
    createdAt: Date = new Date(),
  ) {
    super(id);
    this._eventId = eventId;
    this._notificationId = notificationId;
    this._userId = userId;
    this._status = status;
    this._attempts = attempts;
    this._lastAttemptAt = lastAttemptAt;
    this._deliveredAt = deliveredAt;
    this._errorMessage = errorMessage;
    this._createdAt = createdAt;
  }

  get eventId(): EventId {
    return this._eventId;
  }

  get notificationId(): NotificationId {
    return this._notificationId;
  }

  get userId(): UserId {
    return this._userId;
  }

  get status(): DeliveryStatus {
    return this._status;
  }

  get attempts(): number {
    return this._attempts;
  }

  get lastAttemptAt(): Date | null {
    return this._lastAttemptAt;
  }

  get deliveredAt(): Date | null {
    return this._deliveredAt;
  }

  get errorMessage(): string | null {
    return this._errorMessage;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  markAttempt(errorMessage?: string): void {
    this._attempts += 1;
    this._lastAttemptAt = new Date();
    this._errorMessage = errorMessage || null;
  }

  markDelivered(): void {
    this._status = DeliveryStatus.DELIVERED;
    this._deliveredAt = new Date();
  }

  markFailed(errorMessage?: string): void {
    this._status = DeliveryStatus.FAILED;
    this._errorMessage = errorMessage || null;
  }

  shouldRetry(maxAttempts: number): boolean {
    return this._status === DeliveryStatus.PENDING && this._attempts < maxAttempts;
  }

  static create(
    eventId: EventId,
    notificationId: NotificationId,
    userId: UserId,
  ): NotificationDelivery {
    return new NotificationDelivery(eventId, notificationId, userId);
  }
}
