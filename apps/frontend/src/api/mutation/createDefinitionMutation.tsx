import { openApiClient } from '@lib/orpc';
import { useMutation } from '@tanstack/react-query';

export const mutationKey = 'create-definition';

export const useCreateDefinitionMutation = () => {
  const createDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await openApiClient.definition.create(payload as any);

      return response;
    },
  });

  return createDefinitionMutation;
};
