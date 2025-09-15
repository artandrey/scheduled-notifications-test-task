import { Module } from '@nestjs/common';

import { SharedModule } from './shared/infrastructure/nest/shared.module';
import { NotificationsSenderModule } from './modules/notifications-sender/notifications-sender.module';

@Module({
  imports: [SharedModule, NotificationsSenderModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
