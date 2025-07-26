import { db } from '@db/index';
import { runtimeLogTable, runtimeTaskTable } from '@db/schema';
import { getRuntimeInfo } from '@db/statements';
import { WorkflowPersistor } from '@repo/engine/persistor';
import { type LogEntry, type RUNTIME_TASK_STATUS, type RuntimeInfo, definitionTaskList } from '@repo/engine/types';
import { and, eq } from 'drizzle-orm';

export class DbPostgresPersistor extends WorkflowPersistor {
  async getRuntime(runtimeId: number): Promise<RuntimeInfo> {
    const runtimeTimeInfo = await getRuntimeInfo.execute({ id: runtimeId });

    if (!runtimeTimeInfo) {
      throw new Error('Runtime not found');
    }

    const tasks = definitionTaskList.parse(
      runtimeTimeInfo.tasks?.map((i) => ({
        ...i,
        id: i.taskId,
      }))
    );

    return {
      id: runtimeTimeInfo.id,
      global: runtimeTimeInfo.global ?? {},
      workflowStatus: runtimeTimeInfo.workflowStatus ?? 'added',
      definitionId: runtimeTimeInfo.definitionId,
      tasks: tasks,
    };
  }

  async updateRuntimeTaskStatus(
    runtimeId: number,
    taskId: string,
    status: (typeof RUNTIME_TASK_STATUS)[keyof typeof RUNTIME_TASK_STATUS]
  ): Promise<void> {
    await db
      .update(runtimeTaskTable)
      .set({
        status: status,
      })
      .where(and(eq(runtimeTaskTable.runtimeId, runtimeId), eq(runtimeTaskTable.taskId, taskId)));
  }

  async updateRuntimeTaskResult(runtimeId: number, taskId: string, result: any): Promise<void> {
    await db
      .update(runtimeTaskTable)
      .set({
        result: result,
      })
      .where(and(eq(runtimeTaskTable.runtimeId, runtimeId), eq(runtimeTaskTable.taskId, taskId)));
  }

  async updateRuntimeTaskLogs(logs: LogEntry[]): Promise<void> {
    if (logs.length < 1) {
      return;
    }

    await db.insert(runtimeLogTable).values(logs);
  }
}
