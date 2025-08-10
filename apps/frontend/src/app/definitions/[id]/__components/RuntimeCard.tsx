import type { useListRuntime } from '@/api/query/listRuntime';
import { Button } from '@/components/ui/button';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, EyeIcon } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router';

type RuntimeObject = NonNullable<ReturnType<typeof useListRuntime>['query']['data']>['list'][number];

interface Props {
  id: RuntimeObject['id'];
  workflowStatus: RuntimeObject['workflowStatus'];
  createdAt: RuntimeObject['createdAt'];
}

const RuntimeCard: FC<Props> = ({ createdAt, id, workflowStatus }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Runtime #{id}</CardTitle>
        <CardDescription className="capitalize">
          {workflowStatus}{' '}
          <span title={createdAt} className="inline-flex">
            <Calendar className="h-3 w-3" />
          </span>
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <CardAction>
          <Link to={`/runtime/${id}`} title="View">
            <Button type="button" variant={'outline'} size="icon">
              <EyeIcon className="h-4 w-4" />
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
};

export default RuntimeCard;
