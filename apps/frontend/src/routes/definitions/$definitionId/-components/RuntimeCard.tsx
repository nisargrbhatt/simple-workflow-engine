import type { useListRuntime } from '@/api/query/listRuntime';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Calendar, EyeIcon, ServerCrashIcon } from 'lucide-react';
import type { FC } from 'react';
import { Link } from 'react-router';

type RuntimeObject = NonNullable<ReturnType<typeof useListRuntime>['query']['data']>['list'][number];

interface Props {
  id: RuntimeObject['id'];
  workflowStatus: RuntimeObject['workflowStatus'];
  createdAt: RuntimeObject['createdAt'];
  definitionId: string;
}

const RuntimeCard: FC<Props> = ({ createdAt, id, workflowStatus, definitionId }) => {
  return (
    <Item variant="outline">
      <ItemMedia variant="icon">
        <ServerCrashIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Runtime #{id}</ItemTitle>
        <ItemDescription>
          {workflowStatus}{' '}
          <span title={createdAt} className="inline-flex">
            <Calendar className="h-3 w-3" />
          </span>
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Link to={`/definitions/${definitionId}/runtime/${id}`} title="View">
          <Button type="button" variant={'outline'} size="icon">
            <EyeIcon className="h-4 w-4" />
          </Button>
        </Link>
      </ItemActions>
    </Item>
  );
};

export default RuntimeCard;
