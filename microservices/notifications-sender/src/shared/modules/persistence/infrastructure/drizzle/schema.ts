import { index, pgTable, text, timestamp, uuid, integer } from 'drizzle-orm/pg-core';

export const notificationDeliveries = pgTable('notification_deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull(),
  notificationId: uuid('notification_id').notNull(),
  userId: uuid('user_id').notNull(),
  status: text('status').notNull().default('PENDING'),
  attempts: integer('attempts').notNull().default(0),
  lastAttemptAt: timestamp('last_attempt_at', { mode: 'date', withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { mode: 'date', withTimezone: true }),
  errorMessage: text('error_message'),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('notification_deliveries_event_id_idx').on(table.eventId),
  index('notification_deliveries_notification_id_idx').on(table.notificationId),
  index('notification_deliveries_status_created_at_idx').on(table.status, table.createdAt),
  index('notification_deliveries_last_attempt_at_idx').on(table.lastAttemptAt),
]);
