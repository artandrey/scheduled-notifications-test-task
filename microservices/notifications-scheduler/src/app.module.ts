import { Module } from '@nestjs/common';

import { SharedModule } from './shared/infrastructure/nest/shared.module';
import { NotificationsSchedulerModule } from './modules/notifications-scheduler/notifications-scheduler.module';

@Module({ 
  imports: [SharedModule, NotificationsSchedulerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
