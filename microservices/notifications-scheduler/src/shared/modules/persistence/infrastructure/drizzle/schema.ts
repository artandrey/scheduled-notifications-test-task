import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const scheduledNotifications = pgTable('scheduled_notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  message: text('message').notNull(),
  scheduledAt: timestamp('scheduled_at', { mode: 'date', withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  status: text('status').notNull().default('SCHEDULED'),
}, (table) => [
  index('scheduled_notifications_scheduled_at_idx').on(table.scheduledAt),
  index('scheduled_notifications_status_scheduled_at_idx').on(table.status, table.scheduledAt),
]);

export const processedEvents = pgTable('processed_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  eventId: uuid('event_id').notNull().unique(),
  processedAt: timestamp('processed_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { mode: 'date', withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index('processed_events_created_at_idx').on(table.createdAt),
  index('processed_events_processed_at_idx').on(table.processedAt),
]);
