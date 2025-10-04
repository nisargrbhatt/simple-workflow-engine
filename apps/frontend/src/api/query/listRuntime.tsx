import { openApiClient } from '@lib/orpc';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import z from 'zod/v3';

const responseSchema = z.object({
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

export const useListRuntime = (definitionId: string) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [paginationState, setPaginationState] = useState<{
    page: number;
    size: number;
  }>({
    page: Number(searchParams.get('page') ?? '1'),
    size: Number(searchParams.get('size') ?? '10'),
  });

  const listRuntime = useQuery({
    queryKey: [queryKey, definitionId, paginationState.page, paginationState.size],
    queryFn: async ({ signal }) => {
      const response = await openApiClient.runtime
        .list(
          {
            page: paginationState.page.toString(),
            limit: paginationState.size.toString(),
            definition: Number(definitionId),
          },
          {
            signal,
          }
        )
        .then((res) => responseSchema.parse(res.data));

      return response;
    },
  });

  useEffect(() => {
    setSearchParams({
      page: paginationState.page.toString(),
      size: paginationState.size.toString(),
    });
  }, [paginationState, setSearchParams]);

  return { query: listRuntime, paginationState, setPaginationState };
};
