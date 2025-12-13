import { useDeleteDefinitionMutation } from "@/api/mutation/deleteDefinitionMutation";
import { type fetchDefinitionList, queryKey } from "@/api/query/listDefinition";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { toast } from "sonner";
import { TrashIcon } from "lucide-react";

type DefinitionObject = Awaited<ReturnType<typeof fetchDefinitionList>>["list"][number];

interface Props {
	id: DefinitionObject["id"];
}

const DefinitionDeleteButton: FC<Props> = ({ id }) => {
	const [open, setOpen] = useState<boolean>(false);
	const deleteAction = useDeleteDefinitionMutation();
	const queryClient = useQueryClient();

	const openDialog = () => {
		setOpen(() => true);
	};

	const closeDialog = () => {
		setOpen(() => false);
	};

	const onSubmit = async () => {
		await deleteAction.mutateAsync(
			{ id },
			{
				onSuccess: () => {
					toast.success("Definition deleted successfully");
					queryClient.invalidateQueries({ queryKey: [queryKey] });
					closeDialog();
				},
				onError: (error) => {
					console.error(error);
					toast.error("Definition deleted failed");
				},
			}
		);
	};

	return (
		<>
			<Button type="button" variant={"destructive"} onClick={openDialog} size="icon" title="Delete">
				<TrashIcon />
			</Button>
			<Dialog open={open} onOpenChange={closeDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							This action cannot be undone. This will move your definition to `inactive` status,
							which can not be invoked.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<DialogClose asChild>
							<Button type="button" variant="outline" autoFocus>
								Cancel
							</Button>
						</DialogClose>
						<Button type="button" onClick={onSubmit} disabled={deleteAction.status === "pending"}>
							Continue
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default DefinitionDeleteButton;
