import type { responseSchema } from "@/api/query/listDefinition";
import type { FC } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DefinitionDeleteButton from "./DefinitionDeleteButton";
import { EyeIcon, EditIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type z from "zod/v3";

type DefinitionObject = z.infer<typeof responseSchema>["list"][number];

interface Props {
	id: DefinitionObject["id"];
	name: DefinitionObject["name"];
	description: DefinitionObject["description"];
	status: DefinitionObject["status"];
	createdAt: DefinitionObject["createdAt"];
}

const DefinitionCard: FC<Props> = ({ id, name, description, status, createdAt }) => (
	<Card>
		<CardHeader className="flex w-full flex-row items-center justify-between gap-1">
			<div className="flex flex-col items-start justify-center gap-1">
				<CardTitle>{name}</CardTitle>
				<CardDescription>{new Date(createdAt).toLocaleDateString()}</CardDescription>
			</div>
			<Badge className="capitalize" variant={status === "active" ? "outline" : "destructive"}>
				{status}
			</Badge>
		</CardHeader>
		<CardContent>
			<p className="w-full max-w-[30ch] text-sm text-gray-500">{description}</p>
		</CardContent>
		<CardFooter>
			<CardAction className="flex w-full flex-row items-center justify-end gap-2">
				<Link to={"/definitions/$definitionId"} params={{ definitionId: id.toString() }}>
					<Button type="button" variant={"outline"} size="icon" title="View">
						<EyeIcon />
					</Button>
				</Link>
				<Link to={`/definitions/create`} search={{ definitionId: id }}>
					<Button type="button" variant={"outline"} size="icon" title="Edit">
						<EditIcon />
					</Button>
				</Link>
				{status === "active" ? <DefinitionDeleteButton id={id} /> : null}
			</CardAction>
		</CardFooter>
	</Card>
);

export default DefinitionCard;
