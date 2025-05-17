CREATE TABLE "definitions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "definitions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"description" varchar NOT NULL,
	"type" text DEFAULT 'definition',
	"global" json,
	"status" text DEFAULT 'active' NOT NULL,
	"uiObject" json,
	"tasks" json NOT NULL,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "runtime_logs" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "runtime_logs_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"taskName" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"log" text DEFAULT '',
	"severity" text DEFAULT 'log',
	"runtimeId" integer,
	"definitionId" integer,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "runtimes" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "runtimes_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"global" json,
	"workflowStatus" text DEFAULT 'added',
	"definitionId" integer,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "runtime_tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "runtime_tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar NOT NULL,
	"next" json,
	"previous" json,
	"params" json,
	"exec" varchar,
	"type" text,
	"runtimeId" integer,
	"createdAt" date DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "runtime_logs" ADD CONSTRAINT "runtime_logs_runtimeId_runtimes_id_fk" FOREIGN KEY ("runtimeId") REFERENCES "public"."runtimes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtime_logs" ADD CONSTRAINT "runtime_logs_definitionId_definitions_id_fk" FOREIGN KEY ("definitionId") REFERENCES "public"."definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtimes" ADD CONSTRAINT "runtimes_definitionId_definitions_id_fk" FOREIGN KEY ("definitionId") REFERENCES "public"."definitions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "runtime_tasks" ADD CONSTRAINT "runtime_tasks_runtimeId_runtimes_id_fk" FOREIGN KEY ("runtimeId") REFERENCES "public"."runtimes"("id") ON DELETE no action ON UPDATE no action;