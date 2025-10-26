import {
	RUNTIME_LOG_TYPE,
	RUNTIME_TASK_STATUS,
	TASK_TYPE,
	WORKFLOW_STATUS,
	type DefinitionTask,
} from "@repo/engine/types";
import { integer, pgTable, varchar, json, text, date, timestamp, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const definitionTable = pgTable("definitions", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	name: varchar().notNull(),
	description: varchar().notNull(),
	type: text({
		enum: ["template", "definition"],
	})
		.default("definition")
		.notNull(),
	global: json().$type<Array<{ key: string; value: string }>>(),
	status: text({ enum: ["active", "inactive"] })
		.default("active")
		.notNull(),
	uiObject: json(),
	tasks: json().$type<Array<DefinitionTask>>().notNull(),
	createdAt: date().defaultNow().notNull(),
});

export const definitionTableRelations = relations(definitionTable, ({ many }) => ({
	runtimes: many(runtimeTable, {
		relationName: "definitionRuntimes",
	}),
}));

export const runtimeTable = pgTable("runtimes", {
	id: integer().generatedAlwaysAsIdentity().primaryKey(),
	/**
	 * Why copy?
	 * Because it is possible that user changes global object in definition
	 * while a runtime is being executed
	 * Also, they can pass custom object which can be merged
	 *  */
	global: json().$type<Record<string, any>>(),
	workflowStatus: text({
		enum: [
			WORKFLOW_STATUS.added,
			WORKFLOW_STATUS.pending,
			WORKFLOW_STATUS.completed,
			WORKFLOW_STATUS.failed,
		],
	})
		.default(WORKFLOW_STATUS.added)
		.notNull(),

	definitionId: integer()
		.references(() => definitionTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	createdAt: date().defaultNow().notNull(),
});

export const runtimeTableRelations = relations(runtimeTable, ({ many, one }) => ({
	tasks: many(runtimeTaskTable, {
		relationName: "runtimeTasks",
	}),
	logs: many(runtimeLogTable, {
		relationName: "runtimeLogs",
	}),
	definition: one(definitionTable, {
		fields: [runtimeTable.definitionId],
		references: [definitionTable.id],
		relationName: "runtimeDefinition",
	}),
}));

export const runtimeTaskTable = pgTable(
	"runtime_tasks",
	{
		id: integer().generatedAlwaysAsIdentity().primaryKey(),
		taskId: varchar().notNull(),
		name: varchar().notNull(),
		next: json().$type<Array<string>>(),
		previous: json().$type<Array<string>>(),
		exec: varchar(),
		type: text({
			enum: [
				TASK_TYPE.START,
				TASK_TYPE.END,
				TASK_TYPE.GUARD,
				TASK_TYPE.FUNCTION,
				TASK_TYPE.WAIT,
				TASK_TYPE.LISTEN,
			],
		}).notNull(),
		status: text({
			enum: [
				RUNTIME_TASK_STATUS.added,
				RUNTIME_TASK_STATUS.pending,
				RUNTIME_TASK_STATUS.completed,
				RUNTIME_TASK_STATUS.failed,
			],
		})
			.notNull()
			.default(RUNTIME_TASK_STATUS.added),
		result: json().$type<any>(),
		runtimeId: integer()
			.references(() => runtimeTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: date().defaultNow().notNull(),
	},
	(table) => [index("task_runtime_id_idx").on(table.runtimeId)]
);

export const runtimeTaskTableRelations = relations(runtimeTaskTable, ({ one }) => ({
	runtime: one(runtimeTable, {
		fields: [runtimeTaskTable.runtimeId],
		references: [runtimeTable.id],
		relationName: "runtimeTask",
	}),
}));

export const runtimeLogTable = pgTable(
	"runtime_logs",
	{
		id: integer().generatedAlwaysAsIdentity().primaryKey(),
		taskId: text().notNull(),
		timestamp: timestamp().notNull(),
		log: text().default(""),
		severity: text({
			enum: [
				RUNTIME_LOG_TYPE.log,
				RUNTIME_LOG_TYPE.info,
				RUNTIME_LOG_TYPE.warn,
				RUNTIME_LOG_TYPE.error,
			],
		})
			.default("log")
			.notNull(),
		runtimeId: integer()
			.references(() => runtimeTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		definitionId: integer()
			.references(() => definitionTable.id, {
				onDelete: "cascade",
			})
			.notNull(),
		createdAt: date().defaultNow().notNull(),
	},
	(table) => [index("log_runtime_id_idx").on(table.runtimeId)]
);

export const runtimeLogTableRelations = relations(runtimeLogTable, ({ one }) => ({
	runtime: one(runtimeTable, {
		fields: [runtimeLogTable.runtimeId],
		references: [runtimeTable.id],
		relationName: "runtimeLog",
	}),
	definition: one(definitionTable, {
		fields: [runtimeLogTable.definitionId],
		references: [definitionTable.id],
		relationName: "runtimeDefinition",
	}),
}));
