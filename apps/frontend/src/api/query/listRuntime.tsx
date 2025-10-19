import { openApiClient } from '@lib/orpc';
import { queryOptions } from '@tanstack/react-query';
import z from 'zod/v3';

export const responseSchema = z.object({
  list: z.array(
    z.object({
      id: z.number(),
      workflowStatus: z.enum(['added', 'pending', 'completed', 'failed']),
      createdAt: z.string(),
    })
  ),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    size: z.number(),
  }),
});

export const queryKey = 'list-runtime';

export const listRuntime = async (params: {
  signal?: AbortSignal;
  definitionId: number;
  paginationState: {
    page: number;
    size: number;
  };
}) => {
  const response = await openApiClient.runtime
    .list(
      {
        page: params.paginationState.page.toString(),
        limit: params.paginationState.size.toString(),
        definition: params.definitionId,
      },
      {
        signal: params?.signal,
      }
    )
    .then((res) => responseSchema.parse(res.data));

  return response;
};

export const listRuntimeQuery = (params: {
  definitionId: number;
  paginationState: {
    page: number;
    size: number;
  };
}) =>
  queryOptions({
    queryKey: [queryKey, params.definitionId, params.paginationState.page, params.paginationState.size],
    queryFn: ({ signal }) =>
      listRuntime({
        signal,
        definitionId: params.definitionId,
        paginationState: params.paginationState,
      }),
  });
