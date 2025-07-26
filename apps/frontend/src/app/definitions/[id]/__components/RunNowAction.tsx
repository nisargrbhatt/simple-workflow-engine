import { useRunDefinitionMutation } from '@/api/mutation/runDefinitionMutation';
import type { useFetchDefinition } from '@/api/query/fetchDefinition';
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
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';
import { safeSync } from '@repo/utils';

type DefinitionObject = NonNullable<ReturnType<typeof useFetchDefinition>['data']>;

const formSchema = z.object({
  params: z.string().refine((val) => {
    const result = safeSync(() => JSON.parse(val));
    return result.success;
  }, 'Invalid JSON'),
});

interface Props {
  id: DefinitionObject['id'];
}

const RunNowAction: FC<Props> = ({ id }) => {
  const runDefinition = useRunDefinitionMutation();
  const navigate = useNavigate();

  const paramForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      params: '{}',
    },
  });

  const onSubmit = paramForm.handleSubmit(async (values) => {
    await runDefinition.mutateAsync(
      {
        globalParams: JSON.parse(values.params),
        definitionId: id,
      },
      {
        onSuccess: (data) => {
          toast.success('Engine started successfully');
          if (typeof data?.data?.id === 'number') {
            navigate(`/runtime/${data?.data?.id}`);
          }
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
          <Button type="submit" form="run-now-form" onClick={onSubmit}>
            Run Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RunNowAction;
