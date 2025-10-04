import type { FC, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { useNodesState, useEdgesState } from '@xyflow/react';
import { getRandomIdForTask } from '@lib/random';
import type { EdgePropTypes, NodePropTypes } from '@/components/workflow';
import type { UseFieldArrayReturn, UseFormReturn } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod/v3';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateDefinitionMutation } from '@/api/mutation/createDefinitionMutation';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import type { useFetchEditDefinition } from '@/api/query/fetchEditDefinition';
import { useEditDefinitionMutation } from '@/api/mutation/editDefinitionMutation';

type FetchedDefinitionObject = NonNullable<ReturnType<typeof useFetchEditDefinition>['data']>;

const formSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  global: z.array(
    z.object({
      key: z.string().trim().min(1, 'Key is required'),
      value: z.string().trim().min(1, 'Value is required'),
    })
  ),
});

const CreateDefinitionContext = createContext<{
  nodesState: ReturnType<typeof useNodesState<NodePropTypes>>;
  edgesState: ReturnType<typeof useEdgesState<EdgePropTypes>>;
  definitionForm: UseFormReturn<z.infer<typeof formSchema>>;
  globalValueField: UseFieldArrayReturn<z.infer<typeof formSchema>, 'global', 'id'>;
  onSubmit: () => Promise<void>;
} | null>(null);

export const useCreateDefinitionContext = () => {
  const context = useContext(CreateDefinitionContext);

  if (!context) throw new Error('useCreateDefinitionContext must be used within a CreateDefinitionContextProvider');

  return context;
};

interface Props {
  children: ReactNode;
  defaultValue?: FetchedDefinitionObject;
}

const CreateDefinitionContextProvider: FC<Props> = ({ children, defaultValue }) => {
  const { mutateAsync } = useCreateDefinitionMutation();
  const editMutation = useEditDefinitionMutation();
  const navigate = useNavigate();

  const definitionForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    reValidateMode: 'onChange',
    defaultValues: defaultValue?.definitionForm ?? {
      name: '',
      description: '',
      global: [],
    },
  });

  const globalValueField = useFieldArray({
    control: definitionForm.control,
    name: 'global',
    keyName: 'id',
  });

  const nodesState = useNodesState<NodePropTypes>(
    defaultValue?.flowForm?.nodes ?? [
      {
        id: getRandomIdForTask(),
        type: 'start',
        data: {
          form: {
            label: 'Start Task',
          },
          formValid: true,
        },
        position: { x: 0, y: 0 },
      },
      {
        id: getRandomIdForTask(),
        type: 'end',
        data: {
          form: {
            label: 'End Task',
          },
          formValid: true,
        },
        position: { x: 0, y: 200 },
      },
    ]
  );
  const edgesState = useEdgesState<EdgePropTypes>(defaultValue?.flowForm?.edges ?? []);

  const onSubmit = async () => {
    if (!definitionForm.formState.isValid) {
      toast.error('Definition Detail is invalid', {
        description: 'Please fill all the required fields',
      });
      return;
    }

    const formValues = definitionForm.getValues();

    const [nodes] = nodesState;
    const [edges] = edgesState;

    const workflowDefinitionGraph = nodes?.map((n) => ({
      id: n.id,
      name: n?.data?.form?.label,
      type: n?.type?.toUpperCase(),
      exec: 'exec' in n.data.form ? n?.data?.form?.exec : '',
      next:
        edges
          .filter((l) => l.source === n.id)
          .map((i) => i.target)
          .filter(Boolean) ?? [],
      previous:
        edges
          .filter((l) => l.target === n.id)
          .map((i) => i.source)
          .filter(Boolean) ?? [],
    }));

    const payload = {
      name: formValues.name,
      description: formValues.description,
      type: 'definition',
      global: formValues.global ?? {},
      status: 'active',
      uiObject: {
        nodes: nodes,
        edges: edges,
      },
      tasks: workflowDefinitionGraph,
    };

    if (defaultValue?.payload?.id) {
      await editMutation.mutateAsync(
        {
          id: defaultValue?.payload?.id,
          payload: payload,
        },
        {
          onSuccess: () => {
            navigate('/definitions');
          },
          onError: (error) => {
            console.error(error);
          },
        }
      );
    } else {
      await mutateAsync(payload, {
        onSuccess: () => {
          navigate('/definitions');
        },
        onError: (error) => {
          console.error(error);
        },
      });
    }
  };

  return (
    <CreateDefinitionContext.Provider
      value={{
        nodesState,
        edgesState,
        definitionForm,
        globalValueField,
        onSubmit,
      }}
    >
      {children}
    </CreateDefinitionContext.Provider>
  );
};

export default CreateDefinitionContextProvider;
