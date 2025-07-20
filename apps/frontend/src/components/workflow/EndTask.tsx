import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { memo, useState, type FC } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeleteIcon, OctagonX, SettingsIcon } from 'lucide-react';
import { cn } from '@lib/utils';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
});

type DataProps = {
  form: z.infer<typeof formSchema>;
  formValid: boolean;
};

export type Props = Node<DataProps, 'end'>;

const EndTask: FC<NodeProps<Props>> = ({ data, id, selected }) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData, deleteElements } = useReactFlow();

  const taskForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      label: data?.form?.label,
    },
    resolver: zodResolver(formSchema),
  });

  const toggleDialog = () => {
    setOpen((prev) => !prev);
  };

  const onSubmit = taskForm.handleSubmit(async (values) => {
    updateNodeData(id, {
      form: values ?? {},
      formValid: true,
    });
    toggleDialog();
  });

  const deleteNode = () => {
    deleteElements({
      nodes: [
        {
          id: id,
        },
      ],
    });
  };

  return (
    <>
      <Card className={cn('w-full min-w-[350px]', selected ? 'border-muted-foreground shadow-lg' : '')}>
        <CardHeader className="flex flex-row items-center justify-between gap-1">
          <CardTitle className="flex flex-row items-center justify-start gap-2">
            <OctagonX className="h-6 w-6" />

            <h3 className="text-xl">{data?.form?.label}</h3>
          </CardTitle>

          <div className="flex flex-row items-center justify-end gap-2">
            <Button variant={'outline'} size="icon" type="button" onClick={toggleDialog} title="Configure">
              <SettingsIcon />
            </Button>
            <Button variant={'outline'} size="icon" type="button" onClick={deleteNode} title="Delete">
              <DeleteIcon />
            </Button>
          </div>
        </CardHeader>
        <Handle
          style={{
            height: '11px',
            width: '11px',
          }}
          type="target"
          position={Position.Top}
        />
      </Card>
      <Dialog open={open} onOpenChange={toggleDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{data?.form?.label}</DialogTitle>
            <DialogDescription>End Task Configuration</DialogDescription>
          </DialogHeader>
          <Form {...taskForm}>
            <form className="w-full" noValidate onSubmit={onSubmit} id="end-form-config">
              <div className="flex w-full flex-row items-start justify-start gap-2">
                <FormField
                  control={taskForm.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Label</FormLabel>
                      <FormControl>
                        <Input placeholder="Label" {...field} className="w-full" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button type="submit" form="end-form-config">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(EndTask);
