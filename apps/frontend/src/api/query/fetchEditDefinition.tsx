import { openApiClient } from '@lib/orpc';
import { queryOptions } from '@tanstack/react-query';
import { z } from 'zod/v3';

export const queryKey = 'fetch-edit-definition';

export const responseSchema = z.object({
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

export const fetchEditDefinition = async (params: { signal?: AbortSignal; definitionId: number }) => {
  const response = await openApiClient.definition
    .fetchEdit(
      {
        id: params.definitionId,
      },
      {
        signal: params?.signal,
      }
    )
    .then((res) => responseSchema.parse(res.data));

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
};

export const fetchEditDefinitionQuery = (params: { definitionId: number }) =>
  queryOptions({
    queryKey: [queryKey, params.definitionId],
    queryFn: ({ signal }) => fetchEditDefinition({ signal, definitionId: params.definitionId }),
    gcTime: 0,
    staleTime: 0,
    refetchIntervalInBackground: false,
    retry: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
