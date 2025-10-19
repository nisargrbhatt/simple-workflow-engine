import { fetchEditDefinitionQuery } from "@/api/query/fetchEditDefinition";
import CreateDefinitionContextProvider from "@/contexts/CreateDefinitionContext";
import { useEffect, type FC } from "react";
import DefinitionForm from "./DefinitionForm";
import { useQuery } from "@tanstack/react-query";
import { Navigate } from "@tanstack/react-router";

interface Props {
  definitionId: number;
}

const DefinitionFetcher: FC<Props> = ({ definitionId }) => {
  const { data, isLoading, error } = useQuery(
    fetchEditDefinitionQuery({ definitionId })
  );

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isLoading && !data) {
    return <Navigate to="/definitions" />;
  }

  return (
    <CreateDefinitionContextProvider defaultValue={data}>
      <DefinitionForm />
    </CreateDefinitionContextProvider>
  );
};

export default DefinitionFetcher;
