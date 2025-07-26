import type { LogEntry } from '../types/log';

export class LogPersistor {
  public logs: LogEntry[] = [];

  constructor(
    public runtimeId: number,
    public definitionId: number,
    public taskId: string
  ) {}

  get Logs() {
    return this.logs;
  }

  add(entry: { severity: LogEntry['severity']; log: any | any[] }) {
    try {
      if (typeof entry.log === 'string') {
        this.logs.push({
          definitionId: this.definitionId,
          runtimeId: this.runtimeId,
          log: entry.log,
          severity: entry.severity,
          taskId: this.taskId,
          timestamp: new Date(),
        });
      } else {
        const logString = JSON.stringify(entry.log);

        this.logs.push({
          definitionId: this.definitionId,
          runtimeId: this.runtimeId,
          log: logString,
          severity: entry.severity,
          taskId: this.taskId,
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error adding log', error, entry);
    }
  }
}
