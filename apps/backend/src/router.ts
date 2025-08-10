import { contractOpenSpec } from '@lib/implementor';
import {
  createDefinition,
  deleteDefinition,
  editDefinition,
  fetchDefinition,
  fetchEditDefinition,
  listDefinition,
} from '@modules/definition';
import { processTask, startEngine } from '@modules/engine';
import { getRuntime, listRuntime } from '@modules/runtime';

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
    edit: editDefinition,
  },
  runtime: {
    list: listRuntime,
    get: getRuntime,
  },
});
