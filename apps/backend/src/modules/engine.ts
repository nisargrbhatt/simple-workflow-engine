import { contractOpenSpec } from '@lib/implementor';

export const startEngine = contractOpenSpec.engine.start.handler(async ({ input }) => {
  console.log(input);
  return {
    data: {
      id: 1,
    },
    message: 'Workflow',
  };
});
