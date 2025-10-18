import { useFetchRuntime } from '@/api/query/fetchRuntime';
import { useEffect, type FC } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import RuntimeTaskCard from './-components/RuntimeTaskCard';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCwIcon, ServerCrashIcon, WorkflowIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { Badge } from '@/components/ui/badge';
import RuntimeStartAction from './-components/RuntimeStartAction';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/definitions/$definitionId/runtime/$runtimeId/')({
  component: Index,
});

function Index() {
  const { id, definitionId } = useParams();

  const { data, isLoading, error, refetch, isFetching } = useFetchRuntime(Number(id));

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (!id) {
    return <Navigate to="/runtime" />;
  }

  if (isLoading) {
    return (
      <div className="flex w-full flex-col items-center justify-center">
        <h3>Loading...</h3>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-start items-start gap-1">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/definitions">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to={`/definitions/${definitionId}`}>Definition {definitionId}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Runtime {id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full grid grid-cols-1 gap-2 sm:grid-cols-2 py-2">
        <Item variant="outline">
          <ItemMedia variant="icon" title="Definition">
            <WorkflowIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{data?.definition?.name}</ItemTitle>
            <ItemDescription>{data?.definition?.description}</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon" title="Runtime">
            <ServerCrashIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Runtime #{data?.id}</ItemTitle>
            <ItemDescription className="capitalize">
              {data?.workflowStatus} <Calendar className="h-3 w-3 mb-1 inline" /> {data?.createdAt}
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              title="Refresh"
              disabled={isFetching}
            >
              <RefreshCwIcon className={cn(isFetching && 'animate-spin')} />
            </Button>
            {data?.workflowStatus === 'added' ? <RuntimeStartAction runtime={data} /> : null}
          </ItemActions>
        </Item>
      </div>

      <div className="w-full flex flex-col items-start justify-start gap-2">
        <h3>Tasks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full gap-2">
          {data?.runtimeTasks?.map((t) => (
            <RuntimeTaskCard key={t.id} task={t} />
          ))}
        </div>
        <h3>Logs</h3>

        <div className="w-full flex flex-col items-start justify-start gap-2 border">
          {data?.runtimeLogs?.map((log) => (
            <div key={log.id} className="flex flex-row flex-wrap items-center justify-start gap-2 p-2">
              <Badge variant={'default'} title="severity" className="capitalize">
                {log.severity}
              </Badge>
              <Badge variant={'outline'} title="timestamp">
                {log.timestamp}
              </Badge>
              <p className="text-sm flex-1 w-full" title="message">
                {log?.log}
              </p>
            </div>
          ))}
          {!data?.runtimeLogs || data?.runtimeLogs?.length < 1 ? (
            <p className="text-sm text-center w-full p-2">No logs found</p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
