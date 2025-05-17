import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { definitionTable, runtimeLogTable, runtimeTable, runtimeTaskTable } from "./schema";

const dbUrl = Bun.env.DATABASE_URL!;

const sql = neon(dbUrl);

export const db = drizzle({
  client: sql,
  schema: {
    definition: definitionTable,
    runtime: runtimeTable,
    runtimeTask: runtimeTaskTable,
    runtimeLog: runtimeLogTable,
  },
});
