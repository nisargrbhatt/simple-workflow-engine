import { safeAsync } from '@repo/utils';
import type { LogPersistor } from '../../persistor/log';
import vm from 'node:vm';

export class WorkflowVM {
  constructor(
    public logger: LogPersistor,
    public globalValue: Record<string, any>,
    public taskResults: Record<string, any>
  ) {}

  async process<T = any>(
    exec: string
  ): Promise<{
    result: T;
    timeTaken: number;
  }> {
    const tick = performance.now();

    const context = vm.createContext({
      console: {
        log: (...args: any[]) => this.logger.add({ severity: 'log', log: args }),
        info: (...args: any[]) => this.logger.add({ severity: 'info', log: args }),
        warn: (...args: any[]) => this.logger.add({ severity: 'warn', log: args }),
        error: (...args: any[]) => this.logger.add({ severity: 'error', log: args }),
      },
      workflowGlobal: this.globalValue,
      workflowResults: this.taskResults,
    });

    const evalResult = await safeAsync(
      await vm.runInNewContext(
        `
            ${exec}

            handler();
            `,
        context,
        {
          timeout: 1000 * 30,
        }
      )
    );

    if (!evalResult.success) {
      console.error('Eval failed', evalResult.error);
      const tock = performance.now();
      const timeTaken = (tock - tick) / 1000;
      return {
        result: {} as T,
        timeTaken,
      };
    }

    const tock = performance.now();
    const timeTaken = (tock - tick) / 1000;
    return {
      result: evalResult.data as T,
      timeTaken,
    };
  }
}
