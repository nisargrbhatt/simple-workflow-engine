import { useMutation } from '@tanstack/react-query';
import { backendClient } from '@lib/api';

export const mutationKey = 'create-definition';

export const useCreateDefinitionMutation = () => {
  const createDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await backendClient.post('/rpc/definition/create', payload);
      return response.data;
    },
  });

  return createDefinitionMutation;
};
