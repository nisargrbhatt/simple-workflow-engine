import { openApiClient } from "@lib/orpc";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod/v3";

export const responseSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	global: z
		.array(
			z.object({
				key: z.string(),
				value: z.string(),
			})
		)
		.catch([]),
	status: z.enum(["active", "inactive"]),
	type: z.enum(["template", "definition"]),
	createdAt: z.string(),
	tasks: z.array(z.any()).catch([]),
});

export const queryKey = "fetch-definition";

export const fetchDefinition = async (params: { signal?: AbortSignal; definitionId: number }) => {
	const response = await openApiClient.definition
		.get(
			{
				id: params.definitionId,
			},
			{ signal: params?.signal }
		)
		.then((res) => responseSchema.parse(res.data));

	return response;
};

export const fetchDefinitionQuery = (params: { definitionId: number }) =>
	queryOptions({
		queryKey: [queryKey, params.definitionId],
		queryFn: ({ signal }) => fetchDefinition({ signal, definitionId: params.definitionId }),
	});
