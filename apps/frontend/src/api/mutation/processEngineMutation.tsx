import { openApiClient } from "@lib/orpc";
import { useMutation } from "@tanstack/react-query";

export const mutationKey = "process-engine";

export const useProcessEngineMutation = () => {
	const processEngineMutation = useMutation({
		mutationKey: [mutationKey],
		mutationFn: async (payload: { runtimeId: number; startTaskId: string }) => {
			const response = await openApiClient.engine.process({
				runtimeId: payload.runtimeId,
				taskId: payload.startTaskId,
			});
			return response;
		},
	});

	return processEngineMutation;
};
