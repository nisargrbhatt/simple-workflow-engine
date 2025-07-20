import { backendClient } from '@lib/api';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';

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
  uiObject: z
    .object({
      nodes: z.array(z.any()).catch([]),
      edges: z.array(z.any()).catch([]),
    })
    .catch({
      nodes: [],
      edges: [],
    }),
});

export const queryKey = 'fetch-edit-definition';

export const useFetchEditDefinition = (definitionId: string) => {
  const fetchEditDefinition = useQuery({
    queryKey: [queryKey, definitionId],
    queryFn: async ({ signal }) => {
      const response = await backendClient
        .get(`/rpc/definition/edit/${definitionId}`, {
          signal,
        })
        .then((res) => responseSchema.parse(res.data.data));

      return {
        payload: response,
        definitionForm: {
          name: response.name,
          description: response.description,
          global: response.global,
        },
        flowForm: {
          nodes: response.uiObject.nodes,
          edges: response.uiObject.edges,
        },
      };
    },
    gcTime: 0,
    staleTime: 0,
    refetchIntervalInBackground: false,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return fetchEditDefinition;
};
