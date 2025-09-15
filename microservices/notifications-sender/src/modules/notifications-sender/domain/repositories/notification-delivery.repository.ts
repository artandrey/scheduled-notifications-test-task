import { NotificationDelivery, NotificationDeliveryId, EventId } from '../entities/notification-delivery.entity';

export abstract class NotificationDeliveryRepository {
  abstract save(delivery: NotificationDelivery): Promise<NotificationDeliveryId>;
  abstract findByEventId(eventId: EventId): Promise<NotificationDelivery | null>;
  abstract update(delivery: NotificationDelivery): Promise<void>;
  abstract findById(id: NotificationDeliveryId): Promise<NotificationDelivery | null>;
  abstract existsByEventId(eventId: EventId): Promise<boolean>;
}
