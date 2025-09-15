import { TransactionalAdapterDrizzleOrm } from '@nestjs-cls/transactional-adapter-drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from 'src/shared/modules/persistence/infrastructure/drizzle/schema';

type DbClient = ReturnType<typeof drizzle<typeof schema>>;
export type DrizzlePgClient = DbClient;

export type CjsDrizzleAdapter = TransactionalAdapterDrizzleOrm<DrizzlePgClient>;
export type DrizzleUser = typeof schema.users.$inferSelect;
export type DrizzleOutboxMessage = typeof schema.outboxMessages.$inferSelect;
