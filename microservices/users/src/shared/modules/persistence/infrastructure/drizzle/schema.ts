import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
});

export const outboxMessages = pgTable(
  'outbox_messages',
  {
    id: uuid('id').primaryKey(),
    eventType: text('event_type').notNull(),
    eventData: jsonb('event_data').notNull(),
    createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
    processedAt: timestamp('processed_at', { mode: 'date', withTimezone: true }),
  },
  (table) => [
    index('outbox_messages_event_type_idx').on(table.eventType),
    index('outbox_messages_processed_at_idx').on(table.processedAt),
    index('outbox_messages_created_at_idx').on(table.createdAt),
  ],
);
