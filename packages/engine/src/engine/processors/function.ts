import type { LogPersistor } from '../../persistor/log';
import type { DefinitionTask, ProcessorResult } from '../../types/index';
import { WorkflowVM } from '../vm';

export class FunctionProcessor {
  constructor(
    public params: {
      task: Extract<DefinitionTask, { type: 'FUNCTION' }>;
      global: Record<string, any>;
      taskResults: Record<string, any>;
      logger: LogPersistor;
    }
  ) {}

  async process(): Promise<ProcessorResult<Record<string, any>>> {
    const exec = this.params.task.exec;

    const workflowVM = new WorkflowVM(this.params.logger, this.params.global, this.params.taskResults);

    const result = await workflowVM.process(exec);

    return result;
  }
}
