import { db } from '@db/index';
import { definitionTable, runtimeLogTable, runtimeTable, runtimeTaskTable } from '@db/schema';
import { contractOpenSpec } from '@lib/implementor';
import { safeAsync } from '@repo/utils';
import { count, desc, eq } from 'drizzle-orm';

export const listRuntime = contractOpenSpec.runtime.list.handler(async ({ input, errors }) => {
  const definitionResult = await safeAsync(
    db.query.definition.findFirst({
      where: eq(definitionTable.id, Number(input.definition)),
      columns: {
        id: true,
      },
    })
  );

  if (!definitionResult.success) {
    console.error(definitionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!definitionResult.data) {
    throw errors.BAD_REQUEST({
      message: 'Definition not found',
    });
  }

  const runtimeResult = await safeAsync(
    Promise.all([
      db.query.runtime.findMany({
        where: eq(runtimeTable.definitionId, Number(input.definition)),
        columns: {
          id: true,
          workflowStatus: true,
          createdAt: true,
        },
        orderBy: [desc(runtimeTable.createdAt), desc(runtimeTable.id)],
        offset: (input.page - 1) * input.limit,
        limit: input.limit,
      }),
      db
        .select({
          count: count(),
        })
        .from(runtimeTable)
        .where(eq(runtimeTable.definitionId, Number(input.definition))),
    ])
  );

  if (!runtimeResult.success) {
    console.error(runtimeResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!runtimeResult.data) {
    throw errors.BAD_REQUEST({
      message: 'Runtime not found',
    });
  }

  const [list, countData] = runtimeResult.data;

  return {
    message: 'Runtime listed successfully',
    data: {
      list,
      pagination: {
        total: countData?.at(0)?.count ?? 0,
        page: input.page,
        size: input.limit,
      },
    },
  };
});

export const getRuntime = contractOpenSpec.runtime.get.handler(async ({ input, errors }) => {
  const runtimeResult = await safeAsync(
    db.query.runtime.findFirst({
      where: eq(runtimeTable.id, Number(input.id)),
      columns: {
        id: true,
        workflowStatus: true,
        createdAt: true,
        global: true,
        definitionId: true,
      },
    })
  );

  if (!runtimeResult.success) {
    console.error(runtimeResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (!runtimeResult.data) {
    throw errors.NOT_FOUND({
      message: 'Runtime not found',
    });
  }

  const definition = await db.query.definition.findFirst({
    columns: {
      id: true,
      name: true,
      status: true,
      description: true,
      createdAt: true,
    },
    where: eq(definitionTable.id, runtimeResult.data.definitionId),
  });

  if (!definition) {
    throw errors.NOT_FOUND({
      message: 'Definition not found',
    });
  }

  const runtimeTasks = await db.query.runtimeTask.findMany({
    where: eq(runtimeTaskTable.runtimeId, runtimeResult.data.id),
    columns: {
      id: true,
      taskId: true,
      name: true,
      result: true,
      status: true,
      type: true,
    },
  });

  const runtimeLogs = await db.query.runtimeLog.findMany({
    where: eq(runtimeLogTable.runtimeId, runtimeResult.data.id),
    orderBy: [desc(runtimeLogTable.timestamp)],
    columns: {
      id: true,
      log: true,
      timestamp: true,
      taskId: true,
      severity: true,
    },
  });

  return {
    message: 'Runtime fetched successfully',
    data: {
      id: runtimeResult.data.id,
      createdAt: runtimeResult.data.createdAt,
      workflowStatus: runtimeResult.data.workflowStatus,
      global: runtimeResult.data.global,
      definition: definition,
      runtimeTasks: runtimeTasks,
      runtimeLogs: runtimeLogs,
    },
  };
});
