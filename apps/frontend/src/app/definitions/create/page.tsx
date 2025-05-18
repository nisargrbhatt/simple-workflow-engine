import { FC } from "react";
import DefinitionForm from "./__components/DefinitionForm";
import CreateDefinitionContextProvider from "@/contexts/CreateDefinitionContext";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";

interface Props {}

const CreateDefinitionPage: FC<Props> = () => {
  return (
    <ReactFlowProvider>
      <CreateDefinitionContextProvider>
        <DefinitionForm />
      </CreateDefinitionContextProvider>
    </ReactFlowProvider>
  );
};

export default CreateDefinitionPage;
