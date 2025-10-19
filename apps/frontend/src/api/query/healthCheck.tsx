import { openApiClient } from '@lib/orpc';
import { queryOptions } from '@tanstack/react-query';

export const queryKey = 'health-check';

export const healthCheck = async () => {
  const response = await openApiClient.health.liveness();

  return response;
};

export const healthCheckQuery = () =>
  queryOptions({
    queryKey: [queryKey],
    queryFn: () => healthCheck(),
  });
