import type { Context } from "hono";

export type HonoContext = {
	honoContext?: Context;
	internal?: {
		apiKey: string;
	};
};
