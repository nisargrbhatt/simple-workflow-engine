import { integer, pgTable, varchar, json, text, date, timestamp } from 'drizzle-orm/pg-core';

export const definitionTable = pgTable('definitions', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar().notNull(),
  description: varchar().notNull(),
  type: text({
    enum: ['template', 'definition'],
  }).default('definition'),
  global: json().$type<Array<{ key: string; value: string }>>(),
  status: text({ enum: ['active', 'inactive'] })
    .default('active')
    .notNull(),
  uiObject: json(),
  tasks: json().$type<Array<any>>().notNull(),
  createdAt: date().defaultNow(),
});

export const runtimeTable = pgTable('runtimes', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  /**
   * Why copy?
   * Because it is possible that user changes global object in definition
   * while a runtime is being executed
   * Also, they can pass custom object which can be merged
   *  */
  global: json().$type<Record<string, any>>(),
  workflowStatus: text({
    enum: ['added', 'pending', 'completed', 'failed'],
  }).default('added'),

  definitionId: integer().references(() => definitionTable.id),
  createdAt: date().defaultNow(),
});

export const runtimeTaskTable = pgTable('runtime_tasks', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  name: varchar().notNull(),
  next: json(),
  previous: json(),
  params: json(),
  exec: varchar(),
  type: text({
    enum: ['FUNCTION', 'WAIT', 'START', 'END', 'LISTEN', 'GUARD'],
  }),
  runtimeId: integer().references(() => runtimeTable.id),
  createdAt: date().defaultNow(),
});

export const runtimeLogTable = pgTable('runtime_logs', {
  id: integer().generatedAlwaysAsIdentity().primaryKey(),
  taskName: text().notNull(),
  timestamp: timestamp().notNull(),
  log: text().default(''),
  severity: text({
    enum: ['log', 'info', 'warn', 'error'],
  }).default('log'),
  runtimeId: integer().references(() => runtimeTable.id),
  definitionId: integer().references(() => definitionTable.id),
  createdAt: date().defaultNow(),
});
