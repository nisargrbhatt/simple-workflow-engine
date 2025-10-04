import { openApiClient } from '@lib/orpc';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod/v3';

const responseSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  global: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      })
    )
    .catch([]),
  status: z.enum(['active', 'inactive']),
  type: z.enum(['template', 'definition']),
  createdAt: z.string(),
  tasks: z.array(z.any()).catch([]),
});

export const queryKey = 'fetch-definition';

export const useFetchDefinition = (definitionId: string) => {
  const fetchDefinition = useQuery({
    queryKey: [queryKey, definitionId],
    queryFn: async ({ signal }) => {
      const response = await openApiClient.definition
        .get(
          {
            id: Number(definitionId),
          },
          { signal }
        )
        .then((res) => responseSchema.parse(res.data));

      return response;
    },
  });

  return fetchDefinition;
};
