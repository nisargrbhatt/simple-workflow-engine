import { db } from '@db/index';
import { runtimeLogTable, runtimeTable, runtimeTaskTable } from '@db/schema';
import { getRuntimeInfo, getRuntimeTaskList } from '@db/statements';
import { WorkflowPersistor } from '@repo/engine/persistor';
import {
  type LogEntry,
  type RUNTIME_TASK_STATUS,
  type RuntimeInfo,
  type WORKFLOW_STATUS,
  definitionTaskList,
} from '@repo/engine/types';
import { and, eq } from 'drizzle-orm';
import { processTask } from '@modules/engine';

export class DbPostgresPersistor extends WorkflowPersistor {
  async getRuntime(runtimeId: number): Promise<RuntimeInfo> {
    const runtimeInfo = await getRuntimeInfo.execute({ id: runtimeId });

    if (!runtimeInfo) {
      throw new Error('Runtime not found');
    }

    const runtimeTasks = await getRuntimeTaskList.execute({ runtimeId });

    const tasks = definitionTaskList.parse(
      runtimeTasks?.map((i) => ({
        ...i,
        id: i.taskId,
      }))
    );

    return {
      id: runtimeInfo.id,
      global: runtimeInfo.global ?? {},
      workflowStatus: runtimeInfo.workflowStatus ?? 'added',
      definitionId: runtimeInfo.definitionId,
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

  async updateRuntimeStatus(
    runtimeId: number,
    status: (typeof WORKFLOW_STATUS)[keyof typeof WORKFLOW_STATUS]
  ): Promise<void> {
    await db
      .update(runtimeTable)
      .set({
        workflowStatus: status,
      })
      .where(eq(runtimeTable.id, runtimeId));
  }

  async nextTaskCaller(runtimeId: number, taskId: string): Promise<void> {
    await processTask({
      runtimeId,
      taskId,
    });
  }
}
