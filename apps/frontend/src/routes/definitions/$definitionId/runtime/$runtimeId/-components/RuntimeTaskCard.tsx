import type { fetchRuntime } from "@/api/query/fetchRuntime";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { FC } from "react";

type RuntimeDetailObject = Awaited<ReturnType<typeof fetchRuntime>>;

interface Props {
	task: RuntimeDetailObject["runtimeTasks"][number];
}

const RuntimeTaskCard: FC<Props> = ({ task }) => (
	<Card>
		<CardHeader>
			<CardTitle>
				{task.name} [{task.id}]
			</CardTitle>
			<CardDescription>{task.type}</CardDescription>
		</CardHeader>
		<CardContent>
			<div className="flex flex-col items-start justify-start gap-1 py-1">
				<p className="text-sm">Status:</p>
				<p className="text-sm capitalize">{task.status}</p>
			</div>
			<div className="flex flex-col items-start justify-start gap-1 py-1">
				<p className="text-sm">Result:</p>
				<code>
					<pre>{JSON.stringify(task.result, null, 2)}</pre>
				</code>
			</div>
		</CardContent>
	</Card>
);

export default RuntimeTaskCard;
