import { db } from '@db/index';
import { definitionTable, runtimeTable } from '@db/schema';
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

  return {
    message: 'Runtime fetched successfully',
    data: runtimeResult.data,
  };
});
