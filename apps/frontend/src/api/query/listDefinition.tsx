import { openApiClient } from '@lib/orpc';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';

const responseSchema = z.object({
  list: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      description: z.string(),
      status: z.enum(['active', 'inactive']),
      createdAt: z.string(),
    })
  ),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    size: z.number(),
  }),
});

export const queryKey = 'list-definition';

export const useListDefinition = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [paginationState, setPaginationState] = useState<{
    page: number;
    size: number;
  }>({
    page: Number(searchParams.get('page') ?? '1'),
    size: Number(searchParams.get('size') ?? '10'),
  });

  const listDefinition = useQuery({
    queryKey: [queryKey, paginationState.page, paginationState.size],
    queryFn: async ({ signal }) => {
      const response = await openApiClient.definition
        .list(
          {
            page: paginationState.page.toString(),
            limit: paginationState.size.toString(),
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

  return { query: listDefinition, paginationState, setPaginationState };
};
