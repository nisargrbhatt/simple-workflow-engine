import { openApiClient } from "@lib/orpc";
import { useMutation } from "@tanstack/react-query";

export const mutationKey = "edit-definition";

export const useEditDefinitionMutation = () => {
  const editDefinitionMutation = useMutation({
    mutationKey: [mutationKey],
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Record<string, unknown>;
    }) => {
      const response = await openApiClient.definition.edit({
        params: {
          id,
        },
        body: payload as any,
      });

      return response;
    },
  });

  return editDefinitionMutation;
};
