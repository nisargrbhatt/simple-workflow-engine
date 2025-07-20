import { openApiClient } from '@lib/orpc';
import { useMutation } from '@tanstack/react-query';

export const mutationKey = 'delete-definition';

export const useDeleteDefinitionMutation = () => {
  const deleteDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async (payload: { id: number }) => {
      const response = await openApiClient.definition.delete({
        id: payload.id,
      });

      return response;
    },
  });

  return deleteDefinitionMutation;
};
