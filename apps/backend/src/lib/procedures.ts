import { oo } from "@orpc/openapi";
import { ORPCError, os } from "@orpc/server";
import type { HonoRequest } from "hono";

type HonoContext = {
	internal?: boolean;
	req?: HonoRequest;
};

const internalApiKey = process.env.SERVER_KEY;

export const internalAuth = oo.spec(
	os.$context<HonoContext>().middleware(({ context, next }) => {
		if (context?.internal === true) {
			return next();
		}

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
	os.$context<HonoContext>().middleware(({ context, next }) => {
		if (context?.internal === true) {
			return next();
		}

		const authHeader = context?.req?.header("authorization")?.split(" ")?.at(1);

		if (!authHeader) {
			throw new ORPCError("UNAUTHORIZED", {
				message: "No Auth Header Found",
			});
		}

		if (authHeader !== "token") {
			throw new ORPCError("UNAUTHORIZED", {
				message: "Invalid Token",
			});
		}

		return next();
	}),
	{
		security: [{ bearerAuth: [] }],
	}
);

export const publicProcedures = oo.spec(os.$context<HonoContext>(), {
	security: [],
});

export const privateProcedures = os.$context<HonoContext>().use(privateAuth);

export const internalProcedures = os.$context<HonoContext>().use(internalAuth);
