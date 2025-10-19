import { fetchDefinitionQuery } from "@/api/query/fetchDefinition";
import RunNowAction from "./-components/RunNowAction";
import RuntimeList from "./-components/RuntimeList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryClient } from "@lib/queryClient";
import { useSuspenseQuery } from "@tanstack/react-query";
import z from "zod/v3";
import { ORPCError } from "@orpc/client";
import { Button } from "@/components/ui/button";
import { listRuntimeQuery } from "@/api/query/listRuntime";

export const Route = createFileRoute("/definitions/$definitionId/")({
  component: Index,
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
    size: z.coerce.number().int().min(1).max(10).catch(9).default(9),
  }),
  loaderDeps: (opts) => {
    return {
      paginationState: { page: opts.search.page, size: opts.search.size },
    };
  },
  loader: ({ params, deps }) =>
    Promise.all([
      queryClient.ensureQueryData(
        fetchDefinitionQuery({ definitionId: Number(params.definitionId) })
      ),
      queryClient.ensureQueryData(
        listRuntimeQuery({
          definitionId: Number(params.definitionId),
          paginationState: deps.paginationState,
        })
      ),
    ]),
  onError: (error) => {
    if (error instanceof ORPCError && error.status === 404) {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <div className="flex flex-col justify-center items-center gap-2 w-full h-full">
      <p>Definition not found.</p>
      <Link to={"/definitions"}>
        <Button type="button">Go back to definitions</Button>
      </Link>
    </div>
  ),
});

function Index() {
  const { definitionId } = Route.useParams();
  const { data } = useSuspenseQuery(
    fetchDefinitionQuery({ definitionId: Number(definitionId) })
  );

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/definitions">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Definition {definitionId}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
        {data?.name}
      </h1>
      <p className="text-foreground max-w-2xl text-base font-light sm:text-lg">
        {data?.description}
      </p>
      <RunNowAction />
      <RuntimeList />
    </div>
  );
}
