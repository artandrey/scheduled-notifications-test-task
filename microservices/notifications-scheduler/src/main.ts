import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'notification_scheduler_user_created_queue',
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'notification_scheduler_dlx',
          'x-dead-letter-routing-key': 'user_created_dead',
        },
      },
      // Bind queue to exchange instead of consuming directly
      exchange: 'user_created',
      exchangeType: 'direct',
      routingKey: 'user_created',
      noAck: false,
      prefetchCount: 1,
    },
  });

  await app.listen();
}

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
