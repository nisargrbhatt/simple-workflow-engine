import { implement } from '@orpc/server';
import { contractRouter } from '@repo/orpc';
import type { HonoRequest } from 'hono';

type HonoContext = {
  req: HonoRequest;
};

export const contractOpenSpec = implement(contractRouter).$context<HonoContext>();
