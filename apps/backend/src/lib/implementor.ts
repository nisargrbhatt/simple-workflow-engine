import { implement } from "@orpc/server";
import { contractRouter } from "@repo/orpc";
import type { Context } from "hono";

export const contractOpenSpec = implement(contractRouter).$context<Context>();
