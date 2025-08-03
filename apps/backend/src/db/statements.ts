import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { runtimeTable, runtimeTaskTable } from './schema';

export const getRuntimeInfo = db.query.runtime
  .findFirst({
    where: eq(runtimeTable.id, Number(sql.placeholder('id'))),
  })
  .prepare('getRuntimeInfo');

export const getRuntimeTaskList = db.query.runtimeTask
  .findMany({
    where: eq(runtimeTaskTable.runtimeId, Number(sql.placeholder('runtimeId'))),
  })
  .prepare('getRuntimeTaskList');
