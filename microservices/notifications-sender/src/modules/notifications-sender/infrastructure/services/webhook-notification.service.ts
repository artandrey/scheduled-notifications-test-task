import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance, AxiosError } from 'axios';

import { NotificationService, type NotificationPayload } from '../../application/boundaries/notification.service';
import { Retry } from '../decorators/retry.decorator';

@Injectable()
export class WebhookNotificationService extends NotificationService {
  private readonly _logger = new Logger(WebhookNotificationService.name);
  private readonly _httpClient: AxiosInstance;
  private readonly _webhookUrl: string;

  constructor(private readonly _configService: ConfigService) {
    super();

    this._webhookUrl = this._configService.getOrThrow('WEBHOOK_URL');
    this._httpClient = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Notifications-Sender-Service/1.0',
      },
    });
  }

  @Retry({
    maxAttempts: 5,
    initialDelay: 1000,
    backoffMultiplier: 2,
    maxDelay: 60000,
  })
  async sendNotification(payload: NotificationPayload): Promise<void> {
    try {
      this._logger.log(`Sending notification to webhook: ${payload.notificationId} for user ${payload.userId}`);

      const response = await this._httpClient.post(this._webhookUrl, payload);

      if (response.status >= 200 && response.status < 300) {
        this._logger.log(`Successfully sent notification ${payload.notificationId} to webhook`);
      } else {
        throw new Error(`Webhook responded with status ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        const errorMessage = error.response?.data?.message || error.message;

        this._logger.error(
          `Webhook delivery failed for notification ${payload.notificationId}. ` +
          `Status: ${statusCode}, Error: ${errorMessage}`
        );

        throw new Error(`Webhook delivery failed: ${errorMessage}`);
      }

      this._logger.error(`Network error during webhook delivery for notification ${payload.notificationId}: ${error.message}`);
      throw error;
    }
  }
}
