import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { ScheduleModule } from '@nestjs/schedule';

import { NOTIFICATION_SENDER_SERVICE } from 'src/constants';

import { UserCreatedEventHandler } from './application/event-handlers/user-created.event-handler';
import { NotificationSchedulerService } from './application/services/notification-scheduler.service';
import { NotificationRepository } from './domain/repositories/notification.repository';
import { UserCreatedEventController } from './infrastructure/messaging/rabbitmq/user-created-event.controller';
import { DrizzleNotificationMapper } from './infrastructure/persistence/drizzle/mappers/drizzle-notification.mapper';
import { DrizzleNotificationRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-notification.repository';
import { DrizzleProcessedEventRepository } from './infrastructure/persistence/drizzle/repositories/drizzle-processed-event.repository';
import { InboxCleanupService } from './infrastructure/services/inbox-cleanup.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
  controllers: [UserCreatedEventController],
  providers: [
    UserCreatedEventHandler,
    NotificationSchedulerService,
    InboxCleanupService,
    DrizzleNotificationMapper,
    DrizzleProcessedEventRepository,
    {
      provide: NotificationRepository,
      useClass: DrizzleNotificationRepository,
    },
  ],
  exports: [UserCreatedEventHandler, NotificationSchedulerService],
})
export class NotificationsSchedulerModule {}
