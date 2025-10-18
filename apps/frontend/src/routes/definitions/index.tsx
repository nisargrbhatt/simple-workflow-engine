import { fetchDefinitionList } from '@/api/query/listDefinition';
import SimplePagination from '@/components/helpers/SimplePagination';
import { WorkflowIcon } from 'lucide-react';
import DefinitionCard from './-components/DefinitionCard';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod/v3';

export const Route = createFileRoute('/definitions/')({
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
    fetchDefinitionList({
      paginationState: deps.paginationState,
    }),
  pendingComponent: () => <p>Loading...</p>,
});

function Index() {
  const { list, pagination } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {list?.length < 1 ? (
        <Empty className="mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WorkflowIcon />
            </EmptyMedia>
            <EmptyTitle>No Definitions Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any definitions yet. Get started by creating your first Definition.
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
  );
}
