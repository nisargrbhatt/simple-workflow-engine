import { ORPCError, os } from "@orpc/server";
import { HonoRequest } from "hono";

type HonoContext = {
  req: HonoRequest;
};

const internalApiKey = Bun.env.SERVER_KEY;

export const publicProcedures = os.$context<HonoContext>();

export const privateProcedures = os.$context<HonoContext>().use(({ context, next }) => {
  const authHeader = context.req.header("authorization")?.split(" ")?.at(1);

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
});

export const internalProcedures = os.$context<HonoContext>().use(({ context, next }) => {
  const apiKey = context.req.header("x-api-key");

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
