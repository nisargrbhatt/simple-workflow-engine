import { oc } from '@orpc/contract';
import { z } from 'zod/v3';

export const startEngineContract = oc
  .route({
    method: 'POST',
    path: '/engine/start',
    description: 'It will start workflow engine for specified definition with addition of global params',
    summary: 'Workflow Engine Start',
  })
  .input(
    z.object({
      definitionId: z.number().describe('Workflow Definition Id'),
      globalParams: z.record(z.string(), z.any()).describe('Workflow GlobalParams').optional(),
      autoStart: z.boolean().default(false).describe('Auto Start the Engine'),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        id: z.number().describe('Created Definition Runtime Id'),
      }),
    })
  )
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error',
    },
    BAD_REQUEST: {
      message: "Can't start engine",
    },
  });

export const processTaskContract = oc
  .route({
    method: 'POST',
    path: '/engine/process',
    description: 'It will process workflow engine for specified task',
    summary: 'Workflow Engine Process',
  })
  .input(
    z.object({
      runtimeId: z.number().describe('Workflow Runtime Id'),
      taskId: z.string().describe('Workflow Task Id'),
    })
  )
  .output(
    z.object({
      message: z.string(),
    })
  )
  .errors({
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error',
    },
    BAD_REQUEST: {
      message: "Can't process task",
    },
  });
