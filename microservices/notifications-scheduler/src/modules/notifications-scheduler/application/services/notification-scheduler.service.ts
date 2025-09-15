import { Transactional } from '@nestjs-cls/transactional';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron, CronExpression } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';

import { NOTIFICATION_SENDER_SERVICE } from 'src/constants';

import { NotificationStatus } from '../../domain/entities/notification.entity';
import { NotificationRepository } from '../../domain/repositories/notification.repository';
import { NotificationTriggeredEvent } from '../events/notification-triggered.event';

@Injectable()
export class NotificationSchedulerService {
  private readonly _logger = new Logger(NotificationSchedulerService.name);

  constructor(
    private readonly _notificationRepository: NotificationRepository,
    @Inject(NOTIFICATION_SENDER_SERVICE) private readonly _client: ClientProxy,
  ) {}

  @Cron(CronExpression.EVERY_SECOND)
  @Transactional()
  async processNotifications(): Promise<void> {
    try {
      const now = new Date();
      const notifications = await this._notificationRepository.findByScheduledAtBeforeAndStatus(
        now,
        NotificationStatus.SCHEDULED,
        1000,
      );

      if (notifications.length === 0) {
        return;
      }

      this._logger.log(`Processing ${notifications.length} notifications`);

      for (const notification of notifications) {
        try {
          const event = NotificationTriggeredEvent.fromNotification(
            notification.id,
            notification.userId,
            notification.message,
          );

          await firstValueFrom(this._client.emit('notification_triggered', event.payload));

          await this._notificationRepository.updateStatus(notification.id, NotificationStatus.SENT);

          this._logger.log(`Successfully sent notification ${notification.id} for user ${notification.userId}`);
        } catch (error) {
          this._logger.error(`Failed to process notification ${notification.id}: ${error.message}`, error.stack);

          await this._notificationRepository.updateStatus(notification.id, NotificationStatus.FAILED);
        }
      }
    } catch (error) {
      this._logger.error(`Failed to process notifications: ${error.message}`, error.stack);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  @Transactional()
  async cleanupExpiredNotifications(): Promise<void> {
    try {
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);

      const deletedCount = await this._notificationRepository.deleteByScheduledAtBeforeAndStatus(
        oneHourAgo,
        NotificationStatus.SCHEDULED,
      );

      if (deletedCount > 0) {
        this._logger.log(`Cleaned up ${deletedCount} expired notifications`);
      }
    } catch (error) {
      this._logger.error(`Failed to cleanup expired notifications: ${error.message}`, error.stack);
    }
  }

  async onModuleDestroy() {
    await this._client.close();
  }
}
