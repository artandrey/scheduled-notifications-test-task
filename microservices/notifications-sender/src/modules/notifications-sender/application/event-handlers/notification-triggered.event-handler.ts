import { Injectable, Logger } from '@nestjs/common';

import { NotificationDelivery } from '../../domain/entities/notification-delivery.entity';
import { NotificationDeliveryRepository } from '../../domain/repositories/notification-delivery.repository';
import { NotificationTriggeredEvent } from '../events/notification-triggered.event';
import { NotificationService } from '../boundaries/notification.service';

@Injectable()
export class NotificationTriggeredEventHandler {
  private readonly _logger = new Logger(NotificationTriggeredEventHandler.name);

  constructor(
    private readonly _notificationService: NotificationService,
    private readonly _notificationDeliveryRepository: NotificationDeliveryRepository,
  ) {}

  async handle(event: NotificationTriggeredEvent): Promise<void> {
    this._logger.log(`Processing notification triggered event for user: ${event.userId}`);

    // Check if event has already been processed (inbox pattern using NotificationDelivery)
    const isAlreadyProcessed = await this._notificationDeliveryRepository.existsByEventId(event.eventId);

    if (isAlreadyProcessed) {
      this._logger.log(`Event ${event.eventId} already processed. Skipping.`);
      return;
    }

    const delivery = NotificationDelivery.create(
      event.eventId,
      event.notificationId,
      event.userId,
    );

    const deliveryId = await this._notificationDeliveryRepository.save(delivery);
    this._logger.log(`Created notification delivery record: ${deliveryId}`);

    const payload = {
      notificationId: event.notificationId,
      userId: event.userId,
      message: event.message,
      eventId: event.eventId,
    };

    await this._notificationService.sendNotification(payload);

    const savedDelivery = await this._notificationDeliveryRepository.findById(deliveryId);
    if (savedDelivery) {
      savedDelivery.markDelivered();
      await this._notificationDeliveryRepository.update(savedDelivery);
    }

    this._logger.log(`Successfully processed notification for user: ${event.userId}`);
  }
}
