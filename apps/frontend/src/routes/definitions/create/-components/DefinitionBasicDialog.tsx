import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useCreateDefinitionContext } from "@/contexts/CreateDefinitionContext";
import { DeleteIcon, InfoIcon, Settings } from "lucide-react";
import { useState, type FC } from "react";

interface Props {}

const DefinitionBasicDialog: FC<Props> = () => {
	const [open, setOpen] = useState<boolean>(false);
	const { definitionForm, globalValueField } = useCreateDefinitionContext();

	const onSubmit = definitionForm.handleSubmit(() => {
		setOpen(() => false);
	});

	return (
		<div>
			<Button
				type="button"
				variant={definitionForm.formState.isValid ? "outline" : "destructive"}
				onClick={() => {
					setOpen(() => true);
				}}
			>
				<Settings className="h-4 w-4" />
				Settings
			</Button>

			<Dialog open={open} onOpenChange={() => setOpen((prev) => !prev)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Definition Details</DialogTitle>
						<DialogDescription>
							Define basic details regarding definition like Name, Description and Global values
							which can be used in tasks and can be mutated using start engine call
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
							<div className="flex w-full flex-col items-start justify-start gap-2">
								<div className="flex w-full flex-row items-center justify-start gap-2">
									<p className="text-sm font-semibold">Global Values</p>
									<Tooltip>
										<TooltipTrigger asChild>
											<InfoIcon className="h-3 w-3 cursor-help" />
										</TooltipTrigger>
										<TooltipContent>
											<p>
												Global values are used to store values which can be used in tasks and can be
												mutated using start engine call
											</p>
										</TooltipContent>
									</Tooltip>
								</div>
								{globalValueField.fields.map((f, index) => (
									<div className="flex w-full flex-row items-start justify-start gap-1" key={f.id}>
										<div className="grid w-full grid-cols-1 gap-1 sm:grid-cols-2">
											<FormField
												control={definitionForm.control}
												name={`global.${index}.key`}
												render={({ field }) => (
													<FormItem className="w-full">
														<FormControl>
															<Input placeholder="Key" {...field} className="w-full" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
											<FormField
												control={definitionForm.control}
												name={`global.${index}.value`}
												render={({ field }) => (
													<FormItem className="w-full">
														<FormControl>
															<Input placeholder="Value" {...field} className="w-full" />
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<Button
											type="button"
											size={"icon"}
											variant={"outline"}
											onClick={() => globalValueField.remove(index)}
										>
											<DeleteIcon />
										</Button>
									</div>
								))}
								<Button
									type="button"
									size={"sm"}
									variant={"outline"}
									onClick={() => globalValueField.append({ key: "", value: "" })}
								>
									Add Global Value
								</Button>
							</div>
						</form>
					</Form>
					<DialogFooter>
						<Button type="button" onClick={onSubmit}>
							Submit
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default DefinitionBasicDialog;
