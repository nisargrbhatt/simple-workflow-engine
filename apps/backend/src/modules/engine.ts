import { db } from '@db/index';
import { definitionTable, runtimeTable, runtimeTaskTable } from '@db/schema';
import { DbPostgresPersistor } from '@engine/postgres';
import { contractOpenSpec } from '@lib/implementor';
import { Engine } from '@repo/engine/engine';
import { definitionTaskList } from '@repo/engine/types';
import { safeAsync } from '@repo/utils';
import { and, eq, not } from 'drizzle-orm';

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
    console.error('Definition findFirst failed', definitionResult.error);
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
    status: i.status ?? 'added',
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
    console.error('Transaction failed', transactionResult.error);
    throw errors.INTERNAL_SERVER_ERROR({
      message: 'Internal server error',
    });
  }

  if (input.autoStart === true) {
    const startTaskId = dbTaskRecord.find((i) => i.type === 'START')?.taskId;
    if (!startTaskId) {
      throw errors.BAD_REQUEST({
        message: "Can't find start task in definition",
      });
    }

    await safeAsync(
      processTask({
        runtimeId: transactionResult.data?.createdRuntimeId,
        taskId: startTaskId,
      })
    );
  }

  return {
    data: {
      id: transactionResult.data?.createdRuntimeId,
    },
    message: 'Runtime Engine created successfully',
  };
});

export const processTask = contractOpenSpec.engine.process
  .handler(async ({ input, errors }) => {
    const runtimeResult = await safeAsync(
      db.query.runtime.findFirst({
        where: and(eq(runtimeTable.id, input.runtimeId), not(eq(runtimeTable.workflowStatus, 'completed'))),
        columns: {
          id: true,
        },
      })
    );

    if (!runtimeResult.success) {
      console.error(runtimeResult.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: 'Internal Server Error',
      });
    }

    if (!runtimeResult.data) {
      throw errors.BAD_REQUEST({
        message: 'Runtime not found',
      });
    }

    const runtimeId = runtimeResult.data.id;

    const taskResult = await safeAsync(
      db.query.runtimeTask.findFirst({
        where: and(
          eq(runtimeTaskTable.runtimeId, runtimeId),
          eq(runtimeTaskTable.taskId, input.taskId),
          not(eq(runtimeTaskTable.status, 'completed'))
        ),
        columns: {
          id: true,
          taskId: true,
        },
      })
    );

    if (!taskResult.success) {
      console.error(taskResult.error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: 'Internal Server Error',
      });
    }

    if (!taskResult.data) {
      throw errors.BAD_REQUEST({
        message: 'Task not found',
      });
    }

    const taskId = taskResult.data.taskId;

    const persistor = new DbPostgresPersistor();

    const engine = new Engine(persistor);

    try {
      await engine.setup(runtimeId);
      await engine.process(taskId);
    } catch (error) {
      console.error(error);
      throw errors.INTERNAL_SERVER_ERROR({
        message: 'Internal Server Error',
      });
    }

    return {
      message: 'Task processing started successfully',
    };
  })
  .callable({
    context: {
      internal: true,
    },
  });
