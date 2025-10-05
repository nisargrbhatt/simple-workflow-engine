import { useFetchDefinition } from '@/api/query/fetchDefinition';
import { useEffect, type FC } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import RunNowAction from './__components/RunNowAction';
import RuntimeList from './__components/RuntimeList';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

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
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/definitions">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Definition {id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
