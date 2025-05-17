import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FC } from "react";

interface Props {}

const HomePage: FC<Props> = () => {
  const call = () => {
    fetch("http://localhost:3000/rpc/engine/start", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        workflowDefinitionId: "",
        globalParams: {
          ANY_ADDITIONAL_PROPERTY: "anything",
        },
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello This is a Card</CardTitle>
        <CardDescription>Description regarding Card</CardDescription>
      </CardHeader>
      <CardContent>
        <p> This is a description</p>
      </CardContent>
      <CardFooter>
        <Button variant={"outline"} onClick={call}>
          Hello
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HomePage;
