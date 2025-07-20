import { backendClient } from '@lib/api';
import { useMutation } from '@tanstack/react-query';

export const mutationKey = 'run-definition';

export const useRunDefinitionMutation = () => {
  const runDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: { definitionId: number; globalParams: Record<string, unknown> }) => {
      const response = await backendClient.post<{
        message: string;
        data: {
          id: number;
        };
      }>('/rpc/engine/start', payload);

      return response.data;
    },
  });

  return runDefinitionMutation;
};
