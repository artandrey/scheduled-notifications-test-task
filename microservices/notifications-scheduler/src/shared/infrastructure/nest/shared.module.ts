import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PersistenceModule } from 'src/shared/modules/persistence/infrastructure/nest/persistence.module';


@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PersistenceModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class SharedModule {}
