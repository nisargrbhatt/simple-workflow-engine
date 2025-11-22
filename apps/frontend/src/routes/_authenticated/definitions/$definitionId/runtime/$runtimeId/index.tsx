import { fetchRuntimeQuery } from "@/api/query/fetchRuntime";
import RuntimeTaskCard from "./-components/RuntimeTaskCard";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCwIcon, ServerCrashIcon, WorkflowIcon } from "lucide-react";
import { cn } from "@lib/utils";
import { Badge } from "@/components/ui/badge";
import RuntimeStartAction from "./-components/RuntimeStartAction";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@/components/ui/item";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { queryClient } from "@lib/queryClient";
import { ORPCError } from "@orpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute(
	"/_authenticated/definitions/$definitionId/runtime/$runtimeId/"
)({
	component: Index,
	loader: ({ params }) =>
		queryClient.ensureQueryData(fetchRuntimeQuery({ id: Number(params.runtimeId) })),
	onError: (error) => {
		if (error instanceof ORPCError && error.status === 404) {
			throw notFound();
		}
	},
	notFoundComponent: () => (
		<div className="flex h-full w-full flex-col items-center justify-center gap-2">
			<p>Runtime not found.</p>
			<Link to={"/definitions"}>
				<Button type="button">Go back to definitions</Button>
			</Link>
		</div>
	),
});

function Index() {
	const { runtimeId, definitionId } = Route.useParams();
	const { data, refetch, isFetching } = useSuspenseQuery(
		fetchRuntimeQuery({ id: Number(runtimeId) })
	);

	return (
		<div className="flex h-full w-full flex-col items-start justify-start gap-1">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link to="/definitions">Home</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink asChild>
							<Link
								from={"/definitions/$definitionId/runtime/$runtimeId"}
								to={`/definitions/$definitionId`}
							>
								Definition {definitionId}
							</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Runtime {runtimeId}</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<div className="grid w-full grid-cols-1 gap-2 py-2 sm:grid-cols-2">
				<Item variant="outline">
					<ItemMedia variant="icon" title="Definition">
						<WorkflowIcon />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>{data?.definition?.name}</ItemTitle>
						<ItemDescription>{data?.definition?.description}</ItemDescription>
					</ItemContent>
				</Item>
				<Item variant="outline">
					<ItemMedia variant="icon" title="Runtime">
						<ServerCrashIcon />
					</ItemMedia>
					<ItemContent>
						<ItemTitle>Runtime #{data?.id}</ItemTitle>
						<ItemDescription className="capitalize">
							{data?.workflowStatus} <Calendar className="mb-1 inline h-3 w-3" /> {data?.createdAt}
						</ItemDescription>
					</ItemContent>
					<ItemActions>
						<Button
							type="button"
							variant="outline"
							size="icon"
							onClick={() => refetch()}
							title="Refresh"
							disabled={isFetching}
						>
							<RefreshCwIcon className={cn(isFetching && "animate-spin")} />
						</Button>
						{data?.workflowStatus === "added" ? <RuntimeStartAction runtime={data} /> : null}
					</ItemActions>
				</Item>
			</div>

			<div className="flex w-full flex-col items-start justify-start gap-2">
				<h3>Tasks</h3>
				<div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
					{data?.runtimeTasks?.map((t) => (
						<RuntimeTaskCard key={t.id} task={t} />
					))}
				</div>
				<h3>Logs</h3>

				<div className="flex w-full flex-col items-start justify-start gap-2 border">
					{data?.runtimeLogs?.map((log) => (
						<div
							key={log.id}
							className="flex flex-row flex-wrap items-center justify-start gap-2 p-2"
						>
							<Badge variant={"default"} title="severity" className="capitalize">
								{log.severity}
							</Badge>
							<Badge variant={"outline"} title="timestamp">
								{log.timestamp}
							</Badge>
							<p className="w-full flex-1 text-sm" title="message">
								{log?.log}
							</p>
						</div>
					))}
					{!data?.runtimeLogs || data?.runtimeLogs?.length < 1 ? (
						<p className="w-full p-2 text-center text-sm">No logs found</p>
					) : null}
				</div>
			</div>
		</div>
	);
}
