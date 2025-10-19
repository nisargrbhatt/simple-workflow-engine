import { createFileRoute } from '@tanstack/react-router';
import { healthCheckQuery } from '@/api/query/healthCheck';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { data, error, refetch, isFetching } = useQuery(healthCheckQuery());

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="container flex flex-col items-center justify-center px-4 mx-auto gap-4">
      <h1 className="text-3xl">Simple Workflow Engine</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Engine's Health</CardTitle>
            <CardDescription>
              Service is {isFetching ? 'loading...' : !data ? 'Not Healthy' : 'Healthy'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Please wait if engine is not healthy as our engine is deployed to Render Cloud Free version. It goes to
              sleep after 60sec of inactivity.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              type="button"
              onClick={() => {
                refetch();
              }}
              size="sm"
              disabled={isFetching}
            >
              Refetch
            </Button>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Github</CardTitle>
            <CardDescription>Codebase of this project</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">This project is open source and available on Github.</p>
          </CardContent>
          <CardFooter>
            <a href={'https://github.com/nisargrbhatt/simple-workflow-engine'} target="_blank">
              <Button type="button" size="sm">
                Github
              </Button>
            </a>
          </CardFooter>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Documentation</CardTitle>
            <CardDescription>How to use this project</CardDescription>
          </CardHeader>
          <CardFooter>
            <a href={'https://engine-docs.nisargbhatt.org'} target="_blank">
              <Button type="button" size="sm">
                Docs
              </Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
