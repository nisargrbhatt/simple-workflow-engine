import { openApiClient } from "@lib/orpc";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod/v3";

export const queryKey = "list-definition";

export const responseSchema = z.object({
	list: z.array(
		z.object({
			id: z.number(),
			name: z.string(),
			description: z.string(),
			status: z.enum(["active", "inactive"]),
			createdAt: z.string(),
		})
	),
	pagination: z.object({
		total: z.number(),
		page: z.number(),
		size: z.number(),
	}),
});

export const fetchDefinitionList = async (params: {
	signal?: AbortSignal;
	paginationState: {
		page: number;
		size: number;
	};
}) => {
	const response = await openApiClient.definition
		.list(
			{
				page: params.paginationState.page.toString(),
				limit: params.paginationState.size.toString(),
			},
			{
				signal: params.signal,
			}
		)
		.then((res) => responseSchema.parse(res.data));

	return response;
};

export const definitionListQuery = (params: {
	paginationState: {
		page: number;
		size: number;
	};
}) =>
	queryOptions({
		queryKey: [queryKey, params.paginationState.page, params.paginationState.size],
		queryFn: ({ signal }) =>
			fetchDefinitionList({ signal, paginationState: params.paginationState }),
	});
