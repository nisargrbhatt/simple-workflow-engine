import { oo } from '@orpc/openapi';
import { ORPCError, os } from '@orpc/server';
import type { HonoRequest } from 'hono';
import { env } from 'bun';

type HonoContext = {
  req: HonoRequest;
};

const internalApiKey = env.SERVER_KEY;

const internalAuth = oo.spec(
  os.$context<HonoContext>().middleware(({ context, next }) => {
    const apiKey = context.req.header('x-api-key');

    if (!apiKey) {
      throw new ORPCError('UNAUTHORIZED', {
        message: 'No `x-api-key` Header Found',
      });
    }

    if (apiKey !== internalApiKey) {
      throw new ORPCError('UNAUTHORIZED', {
        message: 'Invalid API Key',
      });
    }

    return next();
  }),
  {
    security: [{ apiKey: [] }],
  }
);

const privateAuth = oo.spec(
  os.$context<HonoContext>().middleware(({ context, next }) => {
    const authHeader = context.req.header('authorization')?.split(' ')?.at(1);

    if (!authHeader) {
      throw new ORPCError('UNAUTHORIZED', {
        message: 'No Auth Header Found',
      });
    }

    if (authHeader !== 'token') {
      throw new ORPCError('UNAUTHORIZED', {
        message: 'Invalid Token',
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
