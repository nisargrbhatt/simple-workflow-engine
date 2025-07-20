import { openApiClient } from '@lib/orpc';
import { useMutation } from '@tanstack/react-query';

export const mutationKey = 'run-definition';

export const useRunDefinitionMutation = () => {
  const runDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: { definitionId: number; globalParams: Record<string, unknown> }) => {
      const response = await openApiClient.engine.start({
        definitionId: payload.definitionId,
        globalParams: payload.globalParams,
      });

      return response;
    },
  });

  return runDefinitionMutation;
};
