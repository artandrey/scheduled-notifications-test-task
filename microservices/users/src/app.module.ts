import { Module } from '@nestjs/common';

import { OutboxPublisherModule } from './modules/outbox-publisher/infrastructure/nest/outbox-publisher.module';
import { UsersModule } from './modules/users/users.module';
import { SharedModule } from './shared/infrastructure/nest/shared.module';

@Module({
  imports: [SharedModule, UsersModule, OutboxPublisherModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
