import type { RUNTIME_LOG_TYPE } from "./constant";

export interface LogEntry {
	taskId: string;
	timestamp: Date;
	log: string;
	severity: (typeof RUNTIME_LOG_TYPE)[keyof typeof RUNTIME_LOG_TYPE];
	runtimeId: number;
	definitionId: number;
}
