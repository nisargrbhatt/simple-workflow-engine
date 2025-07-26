import { eq, sql } from 'drizzle-orm';
import { db } from '.';
import { runtimeTable } from './schema';

export const getRuntimeInfo = db.query.runtime
  .findFirst({
    where: eq(runtimeTable.id, Number(sql.placeholder('id'))),
    with: {
      tasks: true,
    },
  })
  .prepare('getRuntimeInfo');
