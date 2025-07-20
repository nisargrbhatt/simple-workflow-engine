import z from 'zod';
import { publicProcedures } from '@lib/procedures';

export const startEngine = publicProcedures
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
  })
  .handler(async ({ input }) => {
    console.log(input);
    return {
      data: {
        id: 1,
      },
      message: 'Workflow',
    };
  });
