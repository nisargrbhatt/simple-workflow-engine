import { createContext, FC, ReactNode, useContext } from "react";
import { useNodesState, useEdgesState } from "@xyflow/react";
import { getRandomIdForTask } from "@lib/random";
import { EdgePropTypes, NodePropTypes } from "@/components/workflow";
import { useForm } from "react-hook-form";

const CreateDefinitionContext = createContext<{
  nodesState: ReturnType<typeof useNodesState<NodePropTypes>>;
  edgesState: ReturnType<typeof useEdgesState<EdgePropTypes>>;
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
  const definitionForm = useForm();

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
      position: { x: 0, y: 150 },
    },
  ]);
  const edgesState = useEdgesState<EdgePropTypes>([]);

  return (
    <CreateDefinitionContext.Provider
      value={{
        nodesState,
        edgesState,
      }}
    >
      {children}
    </CreateDefinitionContext.Provider>
  );
};

export default CreateDefinitionContextProvider;
