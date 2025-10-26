import DefinitionForm from "./-components/DefinitionForm";
import CreateDefinitionContextProvider from "@/contexts/CreateDefinitionContext";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import DefinitionFetcher from "./-components/DefinitionFetcher";
import { createFileRoute } from "@tanstack/react-router";
import z from "zod/v3";
import { queryClient } from "@lib/queryClient";
import { fetchEditDefinitionQuery } from "@/api/query/fetchEditDefinition";
import { safeAsync } from "@repo/utils";

export const Route = createFileRoute("/definitions/create/")({
	component: Index,
	validateSearch: z.object({
		definitionId: z.coerce.number().optional(),
	}),
	loaderDeps: (opts) => ({
		definitionId: opts.search.definitionId,
	}),
	loader: async ({ deps }) => {
		if (typeof deps?.definitionId === "number") {
			await safeAsync(
				queryClient.ensureQueryData(fetchEditDefinitionQuery({ definitionId: deps.definitionId }))
			);
		}
	},
});

function Index() {
	const { definitionId } = Route.useSearch();

	return (
		<ReactFlowProvider>
			{definitionId ? (
				<DefinitionFetcher definitionId={definitionId} />
			) : (
				<CreateDefinitionContextProvider>
					<DefinitionForm />
				</CreateDefinitionContextProvider>
			)}
		</ReactFlowProvider>
	);
}
