import type { JsonifiedClient } from "@orpc/openapi-client";
import type { ContractRouterClient } from "@orpc/contract";
import { createORPCClient } from "@orpc/client";
import { OpenAPILink } from "@orpc/openapi-client/fetch";
import { contractRouter } from "@repo/orpc";

const link = new OpenAPILink(contractRouter, {
  url: `${import.meta.env.VITE_BACKEND_URL}/rpc`,
});

export const openApiClient: JsonifiedClient<
  ContractRouterClient<typeof contractRouter>
> = createORPCClient(link);
