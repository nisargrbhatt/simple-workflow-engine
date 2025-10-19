import type { DefinitionTask } from './task';

export interface RuntimeInfo {
  id: number;
  global: Record<string, any>;
  workflowStatus: 'added' | 'pending' | 'completed' | 'failed';
  definitionId: number;
  tasks: DefinitionTask[];
}

export interface ProcessorResult<T = any> {
  result: T;
  timeTaken: number;
}
