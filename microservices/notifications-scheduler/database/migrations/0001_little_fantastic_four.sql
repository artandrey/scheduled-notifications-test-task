CREATE INDEX "processed_events_created_at_idx" ON "processed_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "processed_events_processed_at_idx" ON "processed_events" USING btree ("processed_at");--> statement-breakpoint
CREATE INDEX "scheduled_notifications_scheduled_at_idx" ON "scheduled_notifications" USING btree ("scheduled_at");--> statement-breakpoint
CREATE INDEX "scheduled_notifications_status_scheduled_at_idx" ON "scheduled_notifications" USING btree ("status","scheduled_at");