import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload, RmqContext } from '@nestjs/microservices';
import { Transactional } from '@nestjs-cls/transactional';

import { NotificationTriggeredEventHandler } from '../../../application/event-handlers/notification-triggered.event-handler';
import { NotificationTriggeredEvent, type NotificationTriggeredEventPayload } from '../../../application/events/notification-triggered.event';

@Controller()
export class NotificationTriggeredEventController {
  private readonly _logger = new Logger(NotificationTriggeredEventController.name);

  constructor(
    private readonly _notificationTriggeredEventHandler: NotificationTriggeredEventHandler,
  ) {}

  @EventPattern('notification_triggered')
  @Transactional()
  async handleNotificationTriggeredEvent(
    @Payload() payload: NotificationTriggeredEventPayload,
    @Ctx() context: RmqContext,
  ): Promise<void> {
    try {
      this._logger.log(`Received notification_triggered event: ${payload.eventId}`);

      const event = NotificationTriggeredEvent.fromPayload(payload);
      await this._notificationTriggeredEventHandler.handle(event);

      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.ack(originalMessage);

      this._logger.log(`Successfully processed notification_triggered event: ${payload.eventId}`);
    } catch (error) {
      this._logger.error(`Failed to process notification_triggered event: ${error.message}`, error.stack);

      const channel = context.getChannelRef();
      const originalMessage = context.getMessage();
      channel.nack(originalMessage, false, true);

      throw error;
    }
  }
}
