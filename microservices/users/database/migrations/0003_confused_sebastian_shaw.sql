CREATE INDEX "outbox_messages_event_type_idx" ON "outbox_messages" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "outbox_messages_processed_at_idx" ON "outbox_messages" USING btree ("processed_at");--> statement-breakpoint
CREATE INDEX "outbox_messages_created_at_idx" ON "outbox_messages" USING btree ("created_at");