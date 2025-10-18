import DefinitionForm from './-components/DefinitionForm';
import CreateDefinitionContextProvider from '@/contexts/CreateDefinitionContext';
import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useSearchParams } from 'react-router';
import DefinitionFetcher from './-components/DefinitionFetcher';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod/v3';

export const Route = createFileRoute('/definitions/create/')({
  component: Index,
  validateSearch: z.object({
    definitionId: z.coerce.number().optional(),
  }),
});

function Index() {
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
}
