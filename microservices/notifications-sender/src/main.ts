import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL!],
      queue: 'notification_sender_queue',
      queueOptions: {
        durable: true,
        arguments: {
          'x-dead-letter-exchange': 'notification_sender_dlx',
          'x-dead-letter-routing-key': 'notification_triggered_dead',
        },
      },
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
