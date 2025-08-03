import { contractOpenSpec } from '@lib/implementor';
import {
  createDefinition,
  deleteDefinition,
  fetchDefinition,
  fetchEditDefinition,
  listDefinition,
} from '@modules/definition';
import { processTask, startEngine } from '@modules/engine';

export const router = contractOpenSpec.router({
  engine: {
    start: startEngine,
    process: processTask,
  },
  definition: {
    create: createDefinition,
    list: listDefinition,
    fetchEdit: fetchEditDefinition,
    delete: deleteDefinition,
    get: fetchDefinition,
  },
});
