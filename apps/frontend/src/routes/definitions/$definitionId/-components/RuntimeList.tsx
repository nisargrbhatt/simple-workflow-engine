import { listRuntimeQuery } from "@/api/query/listRuntime";
import SimplePagination from "@/components/helpers/SimplePagination";
import { useEffect, type FC } from "react";
import RuntimeCard from "./RuntimeCard";
import { WorkflowIcon } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

interface Props {}

const RuntimeList: FC<Props> = () => {
  const { definitionId } = useParams({ from: "/definitions/$definitionId/" });
  const { page, size } = useSearch({ from: "/definitions/$definitionId/" });
  const navigate = useNavigate();
  const { data, isLoading, error } = useQuery(
    listRuntimeQuery({
      definitionId: Number(definitionId),
      paginationState: { page, size },
    })
  );

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      {isLoading ? <p className="w-full text-center">Loading...</p> : null}
      {data && !isLoading && data?.list?.length < 1 ? (
        <Empty className="mx-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <WorkflowIcon />
            </EmptyMedia>
            <EmptyTitle>No Runtimes Yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any runtimes yet.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}
      {data && !isLoading ? (
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {data?.list?.map((i) => (
            <RuntimeCard
              key={i.id}
              id={i.id}
              workflowStatus={i.workflowStatus}
              createdAt={i.createdAt}
            />
          ))}
        </div>
      ) : null}
      {data?.pagination ? (
        <div className="flex w-full flex-row items-center justify-center">
          <SimplePagination
            pagination={{
              page: data?.pagination?.page,
              size: data?.pagination?.size,
              total: data?.pagination?.total,
            }}
            onChange={(newPage) => {
              navigate({
                from: "/definitions/$definitionId",
                to: "/definitions/$definitionId",
                search: (prev) => ({
                  ...prev,
                  page: newPage,
                }),
              });
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default RuntimeList;
