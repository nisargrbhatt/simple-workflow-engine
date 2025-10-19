import { useProcessEngineMutation } from '@/api/mutation/processEngineMutation';
import { type fetchRuntime, queryKey } from '@/api/query/fetchRuntime';
import { Button } from '@/components/ui/button';
import { safeAsync } from '@repo/utils';
import { useQueryClient } from '@tanstack/react-query';
import { Play } from 'lucide-react';
import type { FC } from 'react';
import { toast } from 'sonner';

type RuntimeDetailObject = Awaited<ReturnType<typeof fetchRuntime>>;

interface Props {
  runtime: RuntimeDetailObject;
}

const RuntimeStartAction: FC<Props> = ({ runtime }) => {
  const { mutateAsync, isPending } = useProcessEngineMutation();
  const queryClient = useQueryClient();

  const onSubmit = async () => {
    const startTaskId = runtime?.runtimeTasks?.find((t) => t.type === 'START')?.taskId;
    const runtimeId = runtime?.id;

    if (!startTaskId) {
      toast.error('Start task not found');
      return;
    }

    await mutateAsync(
      {
        runtimeId: runtimeId,
        startTaskId: startTaskId,
      },
      {
        onError: (error) => {
          console.error(error);
          toast.error('Failed to start runtime');
        },
        onSuccess: (data) => {
          console.log(data);
          toast.success('Runtime started successfully');
          safeAsync(
            queryClient.refetchQueries({
              queryKey: [queryKey, runtime.id],
            })
          );
        },
      }
    );
  };

  return (
    <Button type="button" variant={'outline'} size="icon" title="Run now" onClick={onSubmit} disabled={isPending}>
      <Play />
    </Button>
  );
};

export default RuntimeStartAction;
