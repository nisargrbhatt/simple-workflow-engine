import { useCreateDefinitionContext } from "@/contexts/CreateDefinitionContext";
import type { FC } from "react";
import {
	DropdownMenu,
	DropdownMenuSeparator,
	DropdownMenuGroup,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { OctagonX, PlayIcon, Plus, Shield, SquareFunction } from "lucide-react";
import type { NodeTypes } from "./index";
import { getRandomIdForTask } from "@lib/random";
import {
	FUNCTION_EXECUTION_FUNCTION_CODE,
	GUARD_EXECUTION_FUNCTION_CODE,
} from "@lib/constant/common";

interface Props {}

const TaskAddButton: FC<Props> = () => {
	const { nodesState } = useCreateDefinitionContext();

	const [_, setNodes] = nodesState;

	const nodeCreator = (taskType: keyof typeof NodeTypes) => {
		if (taskType === "start") {
			setNodes((nodes) => [
				...nodes,
				{
					id: getRandomIdForTask(),
					type: "start",
					data: {
						form: {
							label: "Start Task",
						},
						formValid: true,
					},
					position: { x: 0, y: 0 },
				},
			]);
		} else if (taskType === "end") {
			setNodes((nodes) => [
				...nodes,
				{
					id: getRandomIdForTask(),
					type: "end",
					data: {
						form: {
							label: "End Task",
						},
						formValid: true,
					},
					position: { x: 0, y: 100 },
				},
			]);
		} else if (taskType === "guard") {
			setNodes((nodes) => [
				...nodes,
				{
					id: getRandomIdForTask(),
					type: "guard",
					data: {
						form: {
							label: "Guard Task",
							exec: GUARD_EXECUTION_FUNCTION_CODE,
						},
						formValid: true,
					},
					position: { x: 0, y: 100 },
				},
			]);
		} else if (taskType === "function") {
			setNodes((nodes) => [
				...nodes,
				{
					id: getRandomIdForTask(),
					type: "function",
					data: {
						form: {
							label: "Function Task",
							exec: FUNCTION_EXECUTION_FUNCTION_CODE,
						},
						formValid: true,
					},
					position: { x: 0, y: 100 },
				},
			]);
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button size="icon" variant="secondary" className="rounded-full">
					<Plus size={10} />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuLabel>Add Task</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem onClick={() => nodeCreator("start")}>
						<PlayIcon />
						<span>Start Task</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => nodeCreator("end")}>
						<OctagonX />
						<span>End Task</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => nodeCreator("guard")}>
						<Shield />
						<span>Guard Task</span>
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => nodeCreator("function")}>
						<SquareFunction />
						<span>Function Task</span>
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};

export default TaskAddButton;
