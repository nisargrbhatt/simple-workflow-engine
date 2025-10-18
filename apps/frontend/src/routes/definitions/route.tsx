import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import z from 'zod/v3';

export const Route = createFileRoute('/definitions')({
  validateSearch: z.object({
    page: z.coerce.number().int().min(1).catch(1).default(1),
    size: z.coerce.number().int().min(1).max(10).catch(9).default(9),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Home</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
        Definitions
      </h1>
      <p className="text-foreground max-w-2xl text-base font-light sm:text-lg">List of all definitions</p>
      <div className="flex flex-row items-center justify-start gap-1">
        <Route.Link to={'/definitions/create'}>
          <Button>
            <PlusIcon /> Create
          </Button>
        </Route.Link>
      </div>

      <Outlet />
    </div>
  );
}
