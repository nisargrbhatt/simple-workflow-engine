import { implement } from "@orpc/server";
import { contractRouter } from "@repo/orpc";
import { HonoContext } from "./type";

export const contractOpenSpec = implement(contractRouter).$context<HonoContext>();
