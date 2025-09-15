ALTER TABLE "processed_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "processed_events" CASCADE;--> statement-breakpoint
DROP INDEX "notification_deliveries_user_id_idx";--> statement-breakpoint
DROP INDEX "notification_deliveries_status_idx";