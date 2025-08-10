import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { runtimeTable, runtimeTaskTable } from './schema';

export const getRuntimeInfo = db.query.runtime
  .findFirst({
    where: eq(runtimeTable.id, sql.placeholder('id')),
  })
  .prepare('getRuntimeInfo');

export const getRuntimeTaskList = db.query.runtimeTask
  .findMany({
    where: eq(runtimeTaskTable.runtimeId, sql.placeholder('runtimeId')),
  })
  .prepare('getRuntimeTaskList');
