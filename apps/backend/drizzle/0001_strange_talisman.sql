ALTER TABLE "definitions" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "definitions" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_logs" ALTER COLUMN "severity" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_logs" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtimes" ALTER COLUMN "workflowStatus" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtimes" ALTER COLUMN "createdAt" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ALTER COLUMN "createdAt" SET NOT NULL;