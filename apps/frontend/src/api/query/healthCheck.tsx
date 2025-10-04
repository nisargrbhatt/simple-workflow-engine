import { openApiClient } from '@lib/orpc';
import { useQuery } from '@tanstack/react-query';

export const queryKey = 'health-check';

export const useHealthCheck = () => {
  const healthCheck = useQuery({
    queryKey: [queryKey],
    queryFn: async () => {
      const response = await openApiClient.health.liveness();

      return response;
    },
  });

  return healthCheck;
};
