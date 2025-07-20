import type { FC } from 'react';
import DefinitionForm from './__components/DefinitionForm';
import CreateDefinitionContextProvider from '@/contexts/CreateDefinitionContext';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSearchParams } from 'react-router';
import DefinitionFetcher from './__components/DefinitionFetcher';

interface Props {}

const CreateDefinitionPage: FC<Props> = () => {
  const [searchParams] = useSearchParams();

  const definitionId = searchParams.get('definitionId');

  if (definitionId) {
    return <DefinitionFetcher definitionId={definitionId} />;
  }

  return (
    <ReactFlowProvider>
      <CreateDefinitionContextProvider>
        <DefinitionForm />
      </CreateDefinitionContextProvider>
    </ReactFlowProvider>
  );
};

export default CreateDefinitionPage;
