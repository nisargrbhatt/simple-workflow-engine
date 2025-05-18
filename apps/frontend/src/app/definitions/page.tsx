import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { FC } from "react";
import { Link } from "react-router";

interface Props {}

const DefinitionsPage: FC<Props> = () => {
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

      <div className="flex w-full flex-col items-start justify-start gap-2"></div>
    </div>
  );
};

export default DefinitionsPage;
