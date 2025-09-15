import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RmqUrl } from '@nestjs/microservices/external/rmq-url.interface';
import { ScheduleModule } from '@nestjs/schedule';

import { DrizzleRabbitMqOutboxProcessor } from '../drizzle-rabbit-mq/drizzle-rabbit-mq-outbox-processor';
import { RabbitMqEventPublisher } from '../rabbitmq/rabbit-mq-event-publisher';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_PUBLISHER',
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.RMQ,
          options: {
            urls: [configService.getOrThrow<RmqUrl>('RABBITMQ_URL')],
          },
        }),
        inject: [ConfigService],
      },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [RabbitMqEventPublisher, DrizzleRabbitMqOutboxProcessor],
  exports: [RabbitMqEventPublisher],
})
export class OutboxPublisherModule {}
