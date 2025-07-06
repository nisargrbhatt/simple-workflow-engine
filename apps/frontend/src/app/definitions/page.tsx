import { useListDefinition } from "@/api/query/listDefinition";
import SimplePagination from "@/components/helpers/SimplePagination";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PlusIcon } from "lucide-react";
import type { FC } from "react";
import { useEffect } from "react";
import { Link } from "react-router";

interface Props {}

const DefinitionsPage: FC<Props> = () => {
  const { query, setPaginationState } = useListDefinition();
  const { data, isLoading, error } = query;

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <div className="flex w-full flex-col items-start justify-start gap-2">
      <h1 className="text-2xl leading-tight font-bold tracking-tighter sm:text-3xl md:text-4xl lg:leading-[1.1]">
        Definitions
      </h1>
      <p className="text-foreground max-w-2xl text-base font-light sm:text-lg">List of all definitions</p>
      <div className="flex flex-row items-center justify-start gap-1">
        <Link to={"/definitions/create"}>
          <Button>
            <PlusIcon /> Create Definition
          </Button>
        </Link>
      </div>

      <div className="flex w-full flex-col items-start justify-start gap-2">
        {isLoading ? <p className="w-full text-center">Loading...</p> : null}
        {data && !isLoading ? (
          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {data?.list?.map((i) => (
              <Card key={i.id}>
                <CardHeader>
                  <CardTitle>{i.name}</CardTitle>
                  <CardDescription>{new Date(i.createdAt).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="w-full max-w-[30ch] text-sm text-gray-500">{i.description}</p>
                </CardContent>
                <CardFooter>
                  <CardAction>
                    <Link to={`/definitions/${i.id}`}>
                      <Button type="button">View</Button>
                    </Link>
                  </CardAction>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : null}
        {data ? (
          <div className="flex w-full flex-row items-center justify-center">
            <SimplePagination
              pagination={{
                page: data?.pagination?.page,
                size: data?.pagination?.size,
                total: data?.pagination?.total,
              }}
              onChange={(page) => {
                setPaginationState((prev) => ({
                  ...prev,
                  page: page,
                }));
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default DefinitionsPage;
