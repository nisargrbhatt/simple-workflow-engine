import type { Node, NodeProps } from '@xyflow/react';
import { Handle, Position, useConnection, useNodeConnections, useReactFlow } from '@xyflow/react';
import { memo, useState, type FC } from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DeleteIcon, SettingsIcon, SquareFunction } from 'lucide-react';
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
import { ButtonHandle } from './ButtonHandle';
import TaskAddButton from './TaskAddButton';
import type { OnMount } from '@monaco-editor/react';
import { Editor } from '@monaco-editor/react';
import { useTheme } from '@/contexts/ThemeContext';
import { FUNCTION_EXECUTION_FUNCTION_CODE } from '@lib/constant/common';
import { useCreateDefinitionContext } from '@/contexts/CreateDefinitionContext';

const formSchema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
  exec: z
    .string({
      required_error: 'Function code is required',
    })
    .min(1, 'Function code is required'),
});

type DataProps = {
  form: z.infer<typeof formSchema>;
  formValid: boolean;
};

export type Props = Node<DataProps, 'function'>;

const FunctionTask: FC<NodeProps<Props>> = ({ data, id, selected }) => {
  const { theme } = useTheme();
  const connectionInProgress = useConnection((connection) => connection.inProgress);
  const connectionData = useNodeConnections();
  const [open, setOpen] = useState<boolean>(false);
  const { updateNodeData, deleteElements } = useReactFlow();
  const { definitionForm, nodesState } = useCreateDefinitionContext();
  const [nodes] = nodesState;

  const taskForm = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      label: data?.form?.label,
      exec: data?.form?.exec ?? FUNCTION_EXECUTION_FUNCTION_CODE,
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

  const onMount: OnMount = (_, monaco) => {
    const globalValues = definitionForm.getValues().global;

    const ResultMap = nodes.map((node) => `"${node.data?.form?.label}"`).join(' | ');
    const GlobalMap = globalValues.map((global) => `"${global.key}"`).join(' | ');

    monaco?.languages?.typescript?.javascriptDefaults?.addExtraLib(
      `
type ResultMap = Record<${ResultMap}, unknown>;
type GlobalMap = Record<${GlobalMap}, string>;
/**
 * Global values
 */
declare var workflowGlobal: GlobalMap;
/**
 * Results from other tasks
 */
declare var workflowResults: ResultMap;
`,
      'global.d.ts'
    );
  };

  return (
    <>
      <Card className={cn('w-full min-w-[350px]', selected ? 'border-muted-foreground shadow-lg' : '')}>
        <CardHeader className="flex flex-row items-center justify-between gap-1">
          <CardTitle className="flex flex-row items-center justify-start gap-2">
            <SquareFunction className="h-6 w-6" />
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
          type="target"
          position={Position.Top}
          style={{
            height: '11px',
            width: '11px',
          }}
        />

        <ButtonHandle
          type="source"
          position={Position.Bottom}
          showButton={!connectionInProgress && connectionData.length < 1}
        >
          <TaskAddButton />
        </ButtonHandle>
      </Card>
      <Dialog open={open}>
        <DialogContent className="min-w-[320px] sm:min-w-[500px] md:min-w-[756px]">
          <DialogHeader>
            <DialogTitle>{data?.form?.label}</DialogTitle>
            <DialogDescription>Function Task Configuration</DialogDescription>
          </DialogHeader>
          <Form {...taskForm}>
            <form className="w-full" noValidate onSubmit={onSubmit} id="start-form-config">
              <div className="flex w-full flex-col items-start justify-start gap-2">
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
                <FormField
                  control={taskForm.control}
                  name="exec"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Exec</FormLabel>
                      <FormControl>
                        <Editor
                          defaultValue={field.value}
                          onChange={(value) => {
                            field.onChange(value);
                          }}
                          onMount={onMount}
                          language="javascript"
                          height={'50vh'}
                          theme={theme === 'dark' ? 'vs-dark' : 'light'}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
          <DialogFooter>
            <Button type="submit" form="start-form-config">
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(FunctionTask);
