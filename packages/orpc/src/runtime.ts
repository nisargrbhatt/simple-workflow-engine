import { oc } from '@orpc/contract';
import { z } from 'zod/v3';

export const listRuntimeContract = oc
  .route({
    method: 'GET',
    path: '/runtime/list',
    description: 'It will list all workflow runtime',
    summary: 'List Runtime',
    successStatus: 200,
  })
  .input(
    z.object({
      page: z.coerce.number().optional().default(1).catch(1).describe('Page number'),
      limit: z.coerce.number().optional().default(10).catch(10).describe('Limit number'),
      definition: z.coerce.number().describe('Definition Id'),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        pagination: z.object({
          total: z.number().describe('Total count of definitions'),
          page: z.number().describe('Current page number'),
          size: z.number().describe('Number of items per page'),
        }),
        list: z.array(
          z.object({
            id: z.number().describe('Runtime id'),
            workflowStatus: z.enum(['added', 'pending', 'completed', 'failed']).describe('Runtime status'),
            createdAt: z.string().describe('Runtime created at'),
          })
        ),
      }),
    })
  )
  .errors({
    BAD_REQUEST: {
      message: "Can't find definition",
    },
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error',
    },
  });

export const getRuntimeContract = oc
  .route({
    method: 'GET',
    path: '/runtime/{id}',
    description: 'It will get workflow runtime',
    summary: 'Get Runtime',
    successStatus: 200,
  })
  .input(
    z.object({
      id: z.coerce.number().describe('Runtime Id'),
    })
  )
  .output(
    z.object({
      message: z.string(),
      data: z.object({
        id: z.number().describe('Runtime id'),
        workflowStatus: z.enum(['added', 'pending', 'completed', 'failed']).describe('Runtime status'),
        createdAt: z.string().describe('Runtime created at'),
        global: z.record(z.string(), z.any()).nullish(),
      }),
    })
  )
  .errors({
    NOT_FOUND: {
      message: 'Runtime not found',
    },
    INTERNAL_SERVER_ERROR: {
      message: 'Internal server error',
    },
  });
