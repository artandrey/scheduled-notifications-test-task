import { ClsPluginTransactional } from '@nestjs-cls/transactional';
import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsModule } from 'nestjs-cls';

import * as schema from '../drizzle/schema';
import { DrizzlePostgresModule, POSTGRES_DB } from 'src/lib/drizzle-postgres';


@Global()
@Module({
  imports: [
    DrizzlePostgresModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          db: {
            config: {
              connectionString: configService.get('DB_URL'),
            },
            connection: 'pool',
          },
          schema: schema,
          isGlobal: true,
        };
      },
    }),
    ClsModule.forRoot({
      plugins: [
        new ClsPluginTransactional({
          adapter: new TransactionalAdapterDrizzleOrm({
            drizzleInstanceToken: POSTGRES_DB,
          }),
        }),
      ],
    }),
  ],
})
export class PersistenceModule {}
