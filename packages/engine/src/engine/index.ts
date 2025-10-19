import type { ProcessorResult, RuntimeInfo } from '../types/index';
import type { WorkflowPersistor } from '../persistor/index';
import { LogPersistor } from '../persistor/log';
import { StartProcessor } from './processors/start';
import { safeAsync } from '@repo/utils';
import { EndProcessor } from './processors/end';
import { FunctionProcessor } from './processors/function';
import { GuardProcessor } from './processors/guard';

export class Engine {
  runtime: RuntimeInfo | null = null;

  constructor(public db: WorkflowPersistor) {
    console.log('Engine initialized');
  }

  async setup(runtimeId: number) {
    const runtime = await this.db.getRuntime(runtimeId);
    this.runtime = runtime;
  }

  async process(taskId: string) {
    if (!this.runtime) {
      throw new Error('No runtime found. Please call setup first');
    }

    const task = this.runtime?.tasks?.find((t) => t.id === taskId);
    if (!task) {
      throw new Error('Task not found');
    }

    const logger = new LogPersistor(this.runtime?.id, this.runtime?.definitionId, task.id);

    if (task.status === 'completed' || task.status === 'failed') {
      throw new Error('Task is already processed');
    }

    const taskResultMap = new Map<string, any>();
    this.runtime?.tasks?.forEach((t) => {
      taskResultMap.set(t.name, t?.result ?? {});
    });
    const taskResults = Object.fromEntries(taskResultMap);

    await this.db.updateRuntimeTaskStatus(this.runtime.id, task.id, 'pending');

    let result: Awaited<ReturnType<typeof safeAsync<ProcessorResult>>>;

    if (task.type === 'START') {
      const processor = new StartProcessor({
        task,
        global: this.runtime?.global,
        taskResults,
        logger,
      });

      result = await safeAsync(processor.process());
      await this.db.updateRuntimeStatus(this.runtime.id, 'pending');
    } else if (task.type === 'END') {
      const processor = new EndProcessor({
        task,
        global: this.runtime?.global,
        taskResults,
        logger,
      });

      result = await safeAsync(processor.process());
      await this.db.updateRuntimeStatus(this.runtime.id, 'completed');
    } else if (task.type === 'FUNCTION') {
      const processor = new FunctionProcessor({
        task,
        global: this.runtime?.global,
        taskResults,
        logger,
      });

      result = await safeAsync(processor.process());
    } else if (task.type === 'GUARD') {
      const processor = new GuardProcessor({
        task,
        global: this.runtime?.global,
        taskResults,
        logger,
      });

      result = await safeAsync(processor.process());
    } else {
      throw new Error('Invalid task type');
    }

    if (result.success) {
      await this.db.updateRuntimeTaskResult(this.runtime.id, task.id, result.data.result);
      await this.db.updateRuntimeTaskStatus(this.runtime.id, task.id, 'completed');
    } else {
      console.error(result.error);
      await this.db.updateRuntimeTaskStatus(this.runtime.id, task.id, 'failed');
    }

    if (logger.Logs.length > 0) {
      await this.db.updateRuntimeTaskLogs(logger.Logs);
    }

    // Call Next Task Block
    if (result.success) {
      if (task.type === 'START') {
        const nextTasks = task.next;

        this._callNextTasks(nextTasks);
      } else if (task.type === 'FUNCTION') {
        const nextTasks = task.next;

        this._callNextTasks(nextTasks);
      } else if (task.type === 'GUARD') {
        if (result.data.result === true) {
          const nextTasks = task.next;

          this._callNextTasks(nextTasks);
        }
      }
    }
  }

  private async _callNextTasks(nextTaskId: string[]) {
    if (nextTaskId.length < 1) {
      return;
    }

    if (!this.runtime) {
      throw new Error('No runtime found. Please call setup first');
    }

    const runtimeId = this.runtime.id;

    Promise.allSettled(
      nextTaskId.map((taskId) => {
        return this.db.nextTaskCaller(runtimeId, taskId);
      })
    );
  }
}
