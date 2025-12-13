import { ORPCError } from "@orpc/server";
import { getAuth } from "@hono/clerk-auth";
import { contractOpenSpec } from "./implementor";

const internalApiKey = process.env.SERVER_KEY;

export const privateAuthSpec = contractOpenSpec.use(({ context, next }) => {
	if (!context?.honoContext) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Unauthorized",
		});
	}

	const auth = getAuth(context.honoContext);

	if (!auth?.userId) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Unauthorized",
		});
	}

	const authClaims = {
		userId: auth.userId,
	};

	return next({
		context: {
			auth: authClaims,
		},
	});
});

export const internalAuthSpec = contractOpenSpec.use(({ context, next }) => {
	const apiKey = context?.internal?.apiKey;

	if (!apiKey) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "No `x-api-key` Header Found",
		});
	}

	if (apiKey !== internalApiKey) {
		throw new ORPCError("UNAUTHORIZED", {
			message: "Invalid API Key",
		});
	}

	return next();
});
