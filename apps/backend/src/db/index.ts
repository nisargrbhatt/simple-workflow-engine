import { drizzle } from "drizzle-orm/postgres-js";
import {
	definitionTable,
	definitionTableRelations,
	runtimeLogTable,
	runtimeLogTableRelations,
	runtimeTable,
	runtimeTableRelations,
	runtimeTaskTable,
	runtimeTaskTableRelations,
} from "./schema";
import postgres from "postgres";

const dbUrl = process.env.DATABASE_URL!;

const sql = postgres(dbUrl);

export const db = drizzle({
	client: sql,
	schema: {
		definition: definitionTable,
		runtime: runtimeTable,
		runtimeTask: runtimeTaskTable,
		runtimeLog: runtimeLogTable,
		definitionTableRelations: definitionTableRelations,
		runtimeTableRelations: runtimeTableRelations,
		runtimeTaskTableRelations: runtimeTaskTableRelations,
		runtimeLogTableRelations: runtimeLogTableRelations,
	},
});
