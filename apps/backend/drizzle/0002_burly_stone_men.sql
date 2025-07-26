ALTER TABLE "runtime_logs" RENAME COLUMN "taskName" TO "taskId";--> statement-breakpoint
ALTER TABLE "runtime_tasks" RENAME COLUMN "params" TO "status";--> statement-breakpoint
ALTER TABLE "runtime_logs" DROP CONSTRAINT "runtime_logs_runtimeId_runtimes_id_fk";
--> statement-breakpoint
ALTER TABLE "runtime_logs" DROP CONSTRAINT "runtime_logs_definitionId_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "runtimes" DROP CONSTRAINT "runtimes_definitionId_definitions_id_fk";
--> statement-breakpoint
ALTER TABLE "runtime_tasks" DROP CONSTRAINT "runtime_tasks_runtimeId_runtimes_id_fk";
--> statement-breakpoint
ALTER TABLE "runtime_logs" ALTER COLUMN "runtimeId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_logs" ALTER COLUMN "definitionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtimes" ALTER COLUMN "definitionId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ALTER COLUMN "runtimeId" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ADD COLUMN "result" json;--> statement-breakpoint
ALTER TABLE "runtime_logs" ADD CONSTRAINT "runtime_logs_runtimeId_runtimes_id_fk" FOREIGN KEY ("runtimeId") REFERENCES "public"."runtimes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtime_logs" ADD CONSTRAINT "runtime_logs_definitionId_definitions_id_fk" FOREIGN KEY ("definitionId") REFERENCES "public"."definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtimes" ADD CONSTRAINT "runtimes_definitionId_definitions_id_fk" FOREIGN KEY ("definitionId") REFERENCES "public"."definitions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ADD CONSTRAINT "runtime_tasks_runtimeId_runtimes_id_fk" FOREIGN KEY ("runtimeId") REFERENCES "public"."runtimes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "log_runtime_id_idx" ON "runtime_logs" USING btree ("runtimeId");--> statement-breakpoint
CREATE INDEX "task_runtime_id_idx" ON "runtime_tasks" USING btree ("runtimeId");