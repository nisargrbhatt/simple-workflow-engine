import { getAuth } from "@hono/clerk-auth";
import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import type { Context } from "hono";

const internalApiKey = process.env.SERVER_KEY;

export const internalAuth = oo.spec(
	os.$context<Context>().middleware(({ context, next }) => {
		const apiKey = context?.req?.header("x-api-key");

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
	os.$context<Context>().middleware(({ context, next }) => {
		const auth = getAuth(context);

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

export const publicProcedures = oo.spec(os.$context<Context>(), {
	security: [],
});

export const privateProcedures = os.$context<Context>().use(privateAuth);

export const internalProcedures = os.$context<Context>().use(internalAuth);
