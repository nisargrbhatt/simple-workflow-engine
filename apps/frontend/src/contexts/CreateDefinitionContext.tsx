import type { FC, ReactNode } from "react";
import { createContext, useContext } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { getRandomIdForTask } from "@lib/random";
import type { EdgePropTypes, NodePropTypes } from "@/components/workflow";
import type { UseFormReturn } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().trim().min(1, "Description is required"),
  global: z.record(z.string(), z.any()),
});

const CreateDefinitionContext = createContext<{
  nodesState: ReturnType<typeof useNodesState<NodePropTypes>>;
  edgesState: ReturnType<typeof useEdgesState<EdgePropTypes>>;
  definitionForm: UseFormReturn<z.infer<typeof formSchema>>;
} | null>(null);

export const useCreateDefinitionContext = () => {
  const context = useContext(CreateDefinitionContext);

  if (!context) throw new Error("useCreateDefinitionContext must be used within a CreateDefinitionContextProvider");

  return context;
};

interface Props {
  children: ReactNode;
}

const CreateDefinitionContextProvider: FC<Props> = ({ children }) => {
  const definitionForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      global: {},
    },
  });

  const nodesState = useNodesState<NodePropTypes>([
    {
      id: getRandomIdForTask(),
      type: "start",
      data: {
        form: {
          label: "Start Task",
        },
        formValid: true,
      },
      position: { x: 0, y: 0 },
    },
    {
      id: getRandomIdForTask(),
      type: "end",
      data: {
        form: {
          label: "End Task",
        },
        formValid: true,
      },
      position: { x: 0, y: 200 },
    },
  ]);
  const edgesState = useEdgesState<EdgePropTypes>([]);

  return (
    <CreateDefinitionContext.Provider
      value={{
        nodesState,
        edgesState,
        definitionForm,
      }}
    >
      {children}
    </CreateDefinitionContext.Provider>
  );
};

export default CreateDefinitionContextProvider;
