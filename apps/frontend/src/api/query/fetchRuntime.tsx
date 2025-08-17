import { openApiClient } from '@lib/orpc';
import { useQuery } from '@tanstack/react-query';
import z from 'zod/v3';

const responseSchema = z.object({
  id: z.number().describe('Runtime id'),
  workflowStatus: z.enum(['added', 'pending', 'completed', 'failed']).describe('Runtime status'),
  createdAt: z.string().describe('Runtime created at'),
  global: z.record(z.string(), z.any()).nullish(),
  definition: z.object({
    id: z.number().describe('Definition Id'),
    name: z.string().describe('Definition Name'),
    description: z.string().describe('Definition Description'),
    status: z.enum(['active', 'inactive']).describe('Definition Status'),
    createdAt: z.string().nullish().describe('Definition Created At'),
  }),
  runtimeTasks: z
    .array(
      z.object({
        id: z.number(),
        name: z.string(),
        type: z.enum(['END', 'START', 'GUARD', 'FUNCTION', 'WAIT', 'LISTEN']),
        status: z.enum(['added', 'pending', 'completed', 'failed']),
        result: z.any(),
        taskId: z.string(),
      })
    )
    .catch([]),
  runtimeLogs: z
    .array(
      z.object({
        id: z.number(),
        log: z.string().nullish(),
        timestamp: z.string(),
        taskId: z.string(),
        severity: z.enum(['log', 'info', 'error', 'warn']),
      })
    )
    .catch([]),
});

export const queryKey = 'fetch-runtime';

export const useFetchRuntime = (id: number) => {
  const fetchRuntime = useQuery({
    queryKey: [queryKey, id],
    queryFn: async ({ signal }) => {
      const response = await openApiClient.runtime
        .get(
          {
            id,
          },
          {
            signal,
          }
        )
        .then((res) => responseSchema.parse(res.data));

      return response;
    },
  });

  return fetchRuntime;
};
