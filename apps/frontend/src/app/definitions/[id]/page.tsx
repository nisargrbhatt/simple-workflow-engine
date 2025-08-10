import { useFetchDefinition } from '@/api/query/fetchDefinition';
import { useEffect, type FC } from 'react';
import { Navigate, useParams } from 'react-router';
import RunNowAction from './__components/RunNowAction';
import RuntimeList from './__components/RuntimeList';

interface Props {}

const DefinitionDetailPage: FC<Props> = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useFetchDefinition(id ?? '');

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (!id) {
    return <Navigate to="/definitions" />;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <Navigate to="/definitions" />;
  }

  return (
    <div className="flex h-full w-full flex-col items-start justify-start gap-2">
      <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
        {data?.name}
      </h1>
      <p className="text-foreground max-w-2xl text-base font-light sm:text-lg">{data?.description}</p>
      <RunNowAction id={data?.id} />
      <RuntimeList id={id} />
    </div>
  );
};

export default DefinitionDetailPage;
