import { definitionListQuery } from "@/api/query/listDefinition";
import SimplePagination from "@/components/helpers/SimplePagination";
import { WorkflowIcon, PlusIcon } from "lucide-react";
import DefinitionCard from "./-components/DefinitionCard";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod/v3";
import { queryClient } from "@lib/queryClient";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/definitions/")({
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
  loader: ({ deps }) =>
    queryClient.ensureQueryData(
      definitionListQuery({ paginationState: deps.paginationState })
    ),
  pendingComponent: () => <p>Loading...</p>,
});

function Index() {
  const paginationState = Route.useSearch();
  const {
    data: { list, pagination },
  } = useSuspenseQuery(
    definitionListQuery({ paginationState: paginationState })
  );
  const navigate = Route.useNavigate();

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
        Definitions
      </h1>
      <p className="text-foreground max-w-2xl text-base font-light sm:text-lg">
        List of all definitions
      </p>
      <div className="flex flex-row items-center justify-start gap-1">
        <Route.Link to={"/definitions/create"}>
          <Button>
            <PlusIcon /> Create
          </Button>
        </Route.Link>
      </div>
      <div className="flex w-full flex-col items-start justify-start gap-2">
        {list?.length < 1 ? (
          <Empty className="mx-auto">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <WorkflowIcon />
              </EmptyMedia>
              <EmptyTitle>No Definitions Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t created any definitions yet. Get started by
                creating your first Definition.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}
        {list ? (
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {list?.map((i) => (
              <DefinitionCard
                key={i.id}
                id={i.id}
                name={i.name}
                description={i.description}
                status={i.status}
                createdAt={i.createdAt}
              />
            ))}
          </div>
        ) : null}
        {pagination ? (
          <div className="flex w-full flex-row items-center justify-center">
            <SimplePagination
              pagination={{
                page: pagination?.page,
                size: pagination?.size,
                total: pagination?.total,
              }}
              onChange={(page) => {
                navigate({
                  search: (prev) => ({
                    ...prev,
                    page: page,
                  }),
                });
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
