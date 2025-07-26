import { db } from '@db/index';
import { definitionTable, runtimeTable, runtimeTaskTable } from '@db/schema';
import { contractOpenSpec } from '@lib/implementor';
import { definitionTaskList } from '@repo/engine/types';
import { safeAsync } from '@repo/utils';
import { and, eq } from 'drizzle-orm';

export const startEngine = contractOpenSpec.engine.start.handler(async ({ input, errors }) => {
  const definitionResult = await safeAsync(
    db.query.definition.findFirst({
      where: and(
        eq(definitionTable.id, input.definitionId),
        eq(definitionTable.type, 'definition'),
        eq(definitionTable.status, 'active')
      ),
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

  const definitionTasks = definitionTaskList.parse(definitionResult.data.tasks ?? []);

  const dbTaskRecord = definitionTasks.map((i) => ({
    taskId: i.id,
    name: i.name,
    type: i.type,
    next: i.next,
    previous: i.previous,
    exec: i.type === 'FUNCTION' || i.type === 'GUARD' ? i.exec : '',
  }));

  const definitionGlobalMap = new Map<string, string>();

  definitionResult.data.global?.forEach((gVal) => {
    definitionGlobalMap.set(gVal.key, gVal.value);
  });

  const transactionResult = await safeAsync(
    db.transaction(async (tx) => {
      const createdRuntime = await tx
        .insert(runtimeTable)
        .values({
          global: {
            ...Object.fromEntries(definitionGlobalMap.entries()),
            ...(input?.globalParams ?? {}),
          },
          workflowStatus: 'added',
          definitionId: input.definitionId,
        })
        .returning({
          id: runtimeTable.id,
        });

      const createdRuntimeId = createdRuntime?.at(0)?.id;

      if (typeof createdRuntimeId !== 'number') {
        throw errors.BAD_REQUEST({
          message: "Can't start engine",
        });
      }

      await tx.insert(runtimeTaskTable).values(dbTaskRecord.map((i) => ({ ...i, runtimeId: createdRuntimeId })));

      return {
        createdRuntimeId,
      };
    })
  );

  if (!transactionResult.success) {
    console.error(transactionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  return {
    data: {
      id: transactionResult.data?.createdRuntimeId,
    },
    message: 'Runtime Engine created successfully',
  };
});
