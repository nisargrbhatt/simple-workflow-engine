import type { LogPersistor } from '../../persistor/log';
import type { DefinitionTask, ProcessorResult } from '../../types/index';

export class StartProcessor {
  constructor(
    public params: {
      task: Extract<DefinitionTask, { type: 'START' }>;
      global: Record<string, any>;
      taskResults: Record<string, any>;
      logger: LogPersistor;
    }
  ) {}

  async process(): Promise<ProcessorResult<Record<string, any>>> {
    return {
      result: {},
    };
  }
}
