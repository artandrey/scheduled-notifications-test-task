import { Injectable, Logger } from '@nestjs/common';

import { Notification } from 'src/modules/notifications-scheduler/domain/entities/notification.entity';
import { NotificationRepository } from 'src/modules/notifications-scheduler/domain/repositories/notification.repository';
import { UserCreatedEvent } from '../events/user-created.event';

@Injectable()
export class UserCreatedEventHandler {
  private readonly _logger = new Logger(UserCreatedEventHandler.name);

  constructor(
    private readonly _notificationRepository: NotificationRepository,
  ) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    this._logger.log(`Processing user created event for user: ${event.userId}`);

    try {
      const notification = Notification.createWelcomeNotification(event.userId);

      await this._notificationRepository.save(notification);

      this._logger.log(`Successfully scheduled welcome notification for user: ${event.userId}`);
    } catch (error) {
      this._logger.error(`Failed to process user created event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
