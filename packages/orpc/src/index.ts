import {
  createDefinitionContract,
  listDefinitionContract,
  fetchEditDefinitionContract,
  deleteDefinitionContract,
  fetchDefinitionContract,
} from './definition';
import { processTaskContract, startEngineContract } from './engine';
import { oc } from '@orpc/contract';

export const contractRouter = {
  engine: oc.router({
    start: startEngineContract,
    process: processTaskContract,
  }),
  definition: oc.router({
    create: createDefinitionContract,
    list: listDefinitionContract,
    fetchEdit: fetchEditDefinitionContract,
    delete: deleteDefinitionContract,
    get: fetchDefinitionContract,
  }),
};
