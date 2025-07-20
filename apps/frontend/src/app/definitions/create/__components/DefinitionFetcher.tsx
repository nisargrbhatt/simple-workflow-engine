import { useFetchEditDefinition } from '@/api/query/fetchEditDefinition';
import CreateDefinitionContextProvider from '@/contexts/CreateDefinitionContext';
import { ReactFlowProvider } from '@xyflow/react';
import { useEffect, type FC } from 'react';
import { Navigate } from 'react-router';
import DefinitionForm from './DefinitionForm';

interface Props {
  definitionId: string;
}

const DefinitionFetcher: FC<Props> = ({ definitionId }) => {
  const { data, isLoading, error } = useFetchEditDefinition(definitionId);

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
    <ReactFlowProvider>
      <CreateDefinitionContextProvider defaultValue={data}>
        <DefinitionForm />
      </CreateDefinitionContextProvider>
    </ReactFlowProvider>
  );
};

export default DefinitionFetcher;
