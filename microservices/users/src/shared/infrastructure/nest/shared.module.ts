import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

import { CommandBus } from 'src/shared/application/boundaries/command-bus';
import { OutboxPublisher } from 'src/shared/application/boundaries/outbox.publisher';
import { QueryBus } from 'src/shared/application/boundaries/query-bus';
import { PersistenceModule } from 'src/shared/modules/persistence/infrastructure/nest/persistence.module';

import { DrizzleOutboxMessageMapper } from '../persistence/drizzle/mappers/drizzle-outbox-message.mapper';
import { DrizzleOutboxPublisher } from '../persistence/drizzle/repositories/drizzle-outbox.publisher';
import { NestCqrsCommandBus } from '../services/cqrs/nest-cqrs-command-bus';
import { NestCqrsQueryBus } from '../services/cqrs/nest-cqrs-query-bus';

@Global()
@Module({
  imports: [
    CqrsModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PersistenceModule,
  ],
  controllers: [],
  providers: [
    {
      provide: CommandBus,
      useClass: NestCqrsCommandBus,
    },
    {
      provide: QueryBus,
      useClass: NestCqrsQueryBus,
    },
    {
      provide: OutboxPublisher,
      useClass: DrizzleOutboxPublisher,
    },
    DrizzleOutboxMessageMapper,
  ],
  exports: [CommandBus, QueryBus, OutboxPublisher],
})
export class SharedModule {}
