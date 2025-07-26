import { RUNTIME_TASK_STATUS, TASK_TYPE } from './constant';
import { z } from 'zod/v3';

const definitionStartTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.START),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

const definitionEndTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.END),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

const definitionFunctionTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.FUNCTION),
  exec: z.string(),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

const definitionGuardTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.GUARD),
  exec: z.string(),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

const definitionWaitTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.WAIT),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

const definitionListenTask = z.object({
  id: z.string(),
  name: z.string(),
  type: z.literal(TASK_TYPE.LISTEN),
  next: z.array(z.string()),
  previous: z.array(z.string()),
  status: z
    .enum([
      RUNTIME_TASK_STATUS.added,
      RUNTIME_TASK_STATUS.pending,
      RUNTIME_TASK_STATUS.completed,
      RUNTIME_TASK_STATUS.failed,
    ])
    .default(RUNTIME_TASK_STATUS.added),
});

export const definitionTask = z.discriminatedUnion('type', [
  definitionStartTask,
  definitionEndTask,
  definitionFunctionTask,
  definitionGuardTask,
  definitionWaitTask,
  definitionListenTask,
]);

export const definitionTaskList = z.array(definitionTask);

export type DefinitionTask = z.infer<typeof definitionTask>;
