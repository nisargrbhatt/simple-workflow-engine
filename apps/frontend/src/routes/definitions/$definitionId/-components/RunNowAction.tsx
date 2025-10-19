import { useRunDefinitionMutation } from '@/api/mutation/runDefinitionMutation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Editor } from '@monaco-editor/react';
import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod/v3';
import { safeAsync, safeSync } from '@repo/utils';
import { Switch } from '@/components/ui/switch';
import { useQueryClient } from '@tanstack/react-query';
import { queryKey } from '@/api/query/listRuntime';
import { useTheme } from '@/contexts/ThemeContext';
import { Spinner } from '@/components/ui/spinner';
import { useNavigate, useParams } from '@tanstack/react-router';

const formSchema = z.object({
  params: z.string().refine((val) => {
    const result = safeSync(() => JSON.parse(val));
    return result.success;
  }, 'Invalid JSON'),
  autoStart: z.boolean(),
});

interface Props {}

const RunNowAction: FC<Props> = () => {
  const { definitionId } = useParams({ from: '/definitions/$definitionId/' });

  const { theme } = useTheme();
  const runDefinition = useRunDefinitionMutation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const paramForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      params: '{}',
      autoStart: false,
    },
  });

  const onSubmit = paramForm.handleSubmit(async (values) => {
    await runDefinition.mutateAsync(
      {
        globalParams: JSON.parse(values.params),
        definitionId: Number(definitionId),
        autoStart: values.autoStart,
      },
      {
        onSuccess: (data) => {
          toast.success('Engine started successfully');
          if (typeof data?.data?.id === 'number') {
            navigate({
              from: '/definitions/$definitionId',
              to: '/definitions/$definitionId/runtime/$runtimeId',
              params: {
                runtimeId: String(data?.data?.id),
              },
            });
          }
          safeAsync(
            queryClient.invalidateQueries({
              queryKey: [queryKey],
            })
          );
        },
        onError: (error) => {
          console.error(error);
          toast.error('Failed to start engine');
        },
      }
    );
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button">Run Now</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Run Now</DialogTitle>
          <DialogDescription>Run Now</DialogDescription>
        </DialogHeader>
        <Form {...paramForm}>
          <form onSubmit={onSubmit} noValidate id="run-now-form" className="w-full">
            <div className="flex flex-col items-start justify-start gap-2">
              <FormField
                control={paramForm.control}
                name="autoStart"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Auto Start</FormLabel>
                      <FormDescription>Auto start the engine. Else you will have to start it manually.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={paramForm.control}
                name="params"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Params</FormLabel>
                    <FormControl>
                      <Editor
                        height={'30vh'}
                        value={field.value}
                        onChange={(value) => {
                          field.onChange(value);
                        }}
                        options={{
                          minimap: {
                            enabled: false,
                          },
                        }}
                        theme={theme === 'light' ? 'light' : 'vs-dark'}
                        language="json"
                      />
                    </FormControl>
                    <FormDescription>Enter params to run workflow definition</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" form="run-now-form" onClick={onSubmit} disabled={runDefinition.status === 'pending'}>
            {runDefinition.status === 'pending' ? <Spinner /> : null}
            Run Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunNowAction;
