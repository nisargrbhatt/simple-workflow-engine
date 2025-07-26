export const TASK_TYPE = {
  START: 'START',
  END: 'END',
  GUARD: 'GUARD',
  FUNCTION: 'FUNCTION',
  WAIT: 'WAIT',
  LISTEN: 'LISTEN',
} as const;

export const WORKFLOW_STATUS = {
  added: 'added',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
} as const;

export const RUNTIME_LOG_TYPE = {
  log: 'log',
  info: 'info',
  warn: 'warn',
  error: 'error',
} as const;

export const RUNTIME_TASK_STATUS = {
  added: 'added',
  pending: 'pending',
  completed: 'completed',
  failed: 'failed',
} as const;
