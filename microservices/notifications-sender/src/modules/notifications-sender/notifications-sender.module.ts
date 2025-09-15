import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';

import { DrizzleNotificationDeliveryMapper } from './infrastructure/persistence/drizzle/mappers/drizzle-notification-delivery.mapper';
import { DrizzleNotificationDeliveryRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-notification-delivery.repository';
import { NotificationDeliveryRepository } from './domain/repositories/notification-delivery.repository';
import { NotificationTriggeredEventHandler } from './application/event-handlers/notification-triggered.event-handler';
import { NotificationTriggeredEventController } from './infrastructure/messaging/rabbitmq/notification-triggered-event.controller';
import { WebhookNotificationService } from './infrastructure/services/webhook-notification.service';
import { NotificationService } from './application/boundaries/notification.service';
import { NOTIFICATION_SENDER_SERVICE } from 'src/constants';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: NOTIFICATION_SENDER_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<RmqUrl>('RABBITMQ_URL')],
            queue: 'notification_sender_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [NotificationTriggeredEventController],
  providers: [
    NotificationTriggeredEventHandler,
    WebhookNotificationService,
    DrizzleNotificationDeliveryMapper,
    {
      provide: NotificationDeliveryRepository,
      useClass: DrizzleNotificationDeliveryRepository,
    },
    {
      provide: NotificationService,
      useClass: WebhookNotificationService,
    },
  ],
  exports: [
    NotificationTriggeredEventHandler,
    NotificationService,
  ],
})
export class NotificationsSenderModule {}
