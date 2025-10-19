import type { listRuntime } from '@/api/query/listRuntime';
import { Button } from '@/components/ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Link } from '@tanstack/react-router';
import { Calendar, EyeIcon, ServerCrashIcon } from 'lucide-react';
import type { FC } from 'react';

type RuntimeObject = Awaited<ReturnType<typeof listRuntime>>['list'][number];

interface Props {
  id: RuntimeObject['id'];
  workflowStatus: RuntimeObject['workflowStatus'];
  createdAt: RuntimeObject['createdAt'];
}

const RuntimeCard: FC<Props> = ({ createdAt, id, workflowStatus }) => {
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
        <Link
          from={'/definitions/$definitionId'}
          to={'/definitions/$definitionId/runtime/$runtimeId'}
          params={{
            runtimeId: String(id),
          }}
          title="View"
        >
          <Button type="button" variant={'outline'} size="icon">
            <EyeIcon className="h-4 w-4" />
          </Button>
        </Link>
      </ItemActions>
    </Item>
  );
};

export default RuntimeCard;
