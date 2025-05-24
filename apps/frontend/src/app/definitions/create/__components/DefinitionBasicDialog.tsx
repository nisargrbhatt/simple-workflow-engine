import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDefinitionContext } from "@/contexts/CreateDefinitionContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Editor } from "@monaco-editor/react";
import { Settings } from "lucide-react";
import type { FC } from "react";

interface Props {}

const DefinitionBasicDialog: FC<Props> = () => {
  const { theme } = useTheme();
  const { definitionForm } = useCreateDefinitionContext();

  const onSubmit = definitionForm.handleSubmit((values) => {
    console.log(values);
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Definition Details</DialogTitle>
          <DialogDescription>
            Define basic details regarding definition like Name, Description and Global values which can be used in
            tasks and can be mutated using start engine call
          </DialogDescription>
        </DialogHeader>
        <Form {...definitionForm}>
          <form
            onSubmit={onSubmit}
            id="definition-basic-form"
            className="flex w-full flex-col items-start justify-start gap-2"
          >
            <FormField
              control={definitionForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={definitionForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} className="w-full" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={definitionForm.control}
              name="global"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Global</FormLabel>
                  <FormControl>
                    <Editor
                      defaultValue={JSON.stringify(field.value, null, 2)}
                      onChange={(value) => {
                        try {
                          field.onChange(JSON.parse(value ?? "{}"));
                        } catch (error) {
                          console.error(error);
                        }
                      }}
                      language="json"
                      height={"50vh"}
                      theme={theme === "dark" ? "vs-dark" : "light"}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DefinitionBasicDialog;
