import { useFetchRuntime } from '@/api/query/fetchRuntime';
import { useEffect, type FC } from 'react';
import { Navigate, useParams } from 'react-router';
import RuntimeTaskCard from './__components/RuntimeTaskCard';
import { Button } from '@/components/ui/button';
import { RefreshCwIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { Badge } from '@/components/ui/badge';
import RuntimeStartAction from './__components/RuntimeStartAction';

interface Props {}

const RuntimeDetail: FC<Props> = () => {
  const { id } = useParams();

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
      <div className="w-full flex flex-row justify-between items-start gap-1 pb-2 border-b">
        <div className="flex flex-col items-start justify-start gap-1">
          <h1 className="text-2xl">{data?.definition?.name}</h1>
          <p className="font-normal text-sm">{data?.definition?.description}</p>
        </div>
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-sm capitalize">{data?.definition?.status}</p>
          <p className="text-sm">{data?.definition?.createdAt}</p>
        </div>
      </div>
      <div className="w-full flex flex-col items-start justify-start gap-2">
        <div className="w-full flex flex-row justify-between items-start gap-1">
          <div className="flex flex-col items-start justify-start gap-1">
            <h3>Runtime #{data?.id}</h3>
            <div className="flex flex-row justify-start items-center gap-1">
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
            </div>
          </div>
          <div className="flex flex-col items-start justify-start gap-1">
            <p className="text-sm capitalize">{data?.workflowStatus}</p>
            <p className="text-sm">{data?.createdAt}</p>
          </div>
        </div>
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
              <Badge variant={'default'} title="severity">
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
};

export default RuntimeDetail;
