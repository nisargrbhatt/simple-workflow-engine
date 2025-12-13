import { getAuth } from "@hono/clerk-auth";
import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import { HonoContext } from "./type";

const internalApiKey = process.env.SERVER_KEY;

export const internalAuth = oo.spec(
	os.$context<HonoContext>().middleware(({ context, next }) => {
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
	}),
	{
		security: [{ apiKey: [] }],
	}
);

export const privateAuth = oo.spec(
	os.$context<HonoContext>().middleware(({ context, next }) => {
		if (!context.honoContext) {
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

		return next({
			context: {
				auth: auth,
			},
		});
	}),
	{
		security: [{ bearerAuth: [] }],
	}
);
