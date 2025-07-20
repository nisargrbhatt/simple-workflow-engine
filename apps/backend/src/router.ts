import { contractOpenSpec } from '@lib/implementor';
import {
  createDefinition,
  deleteDefinition,
  fetchDefinition,
  fetchEditDefinition,
  listDefinition,
} from '@modules/definition';
import { startEngine } from '@modules/engine';

export const router = contractOpenSpec.router({
  engine: {
    start: startEngine,
  },
  definition: {
    create: createDefinition,
    list: listDefinition,
    fetchEdit: fetchEditDefinition,
    delete: deleteDefinition,
    get: fetchDefinition,
  },
});
