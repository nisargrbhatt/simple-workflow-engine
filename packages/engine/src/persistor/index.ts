import type { RuntimeInfo } from '../types/internal';
import type { RUNTIME_TASK_STATUS, WORKFLOW_STATUS } from '../types/constant';
import type { LogEntry } from '../types/log';

export abstract class WorkflowPersistor {
  abstract getRuntime(runtimeId: number): Promise<RuntimeInfo>;

  abstract updateRuntimeTaskStatus(
    runtimeId: number,
    taskId: string,
    status: (typeof RUNTIME_TASK_STATUS)[keyof typeof RUNTIME_TASK_STATUS]
  ): Promise<void>;

  abstract updateRuntimeTaskResult(runtimeId: number, taskId: string, result: any): Promise<void>;

  abstract updateRuntimeTaskLogs(logs: LogEntry[]): Promise<void>;

  abstract updateRuntimeStatus(
    runtimeId: number,
    status: (typeof WORKFLOW_STATUS)[keyof typeof WORKFLOW_STATUS]
  ): Promise<void>;

  abstract nextTaskCaller(runtimeId: number, taskId: string): Promise<void>;
}
