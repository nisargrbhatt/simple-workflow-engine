import type { ProcessorResult, RuntimeInfo } from '../types/index';
import type { WorkflowPersistor } from '../persistor/index';
import { LogPersistor } from 'src/persistor/log';
import { StartProcessor } from './processors/start';
import { safeAsync } from '@repo/utils';

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

    await this.db.updateRuntimeTaskStatus(this.runtime.id, task.id, 'pending');

    let result: Awaited<ReturnType<typeof safeAsync<ProcessorResult>>>;

    if (task.type === 'START') {
      const processor = new StartProcessor({
        task,
        global: this.runtime?.global,
        taskResults: {},
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
      await this.db.updateRuntimeTaskStatus(this.runtime.id, task.id, 'failed');
    }

    if (logger.Logs.length > 0) {
      await this.db.updateRuntimeTaskLogs(logger.Logs);
    }
  }
}
