import { useMutation } from '@tanstack/react-query';
import { backendClient } from '@lib/api';

export const mutationKey = 'delete-definition';

export const useDeleteDefinitionMutation = () => {
  const deleteDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: { id: number }) => {
      const response = await backendClient.delete(`/rpc/definition/delete/${payload.id}`);
      return response.data;
    },
  });

  return deleteDefinitionMutation;
};
