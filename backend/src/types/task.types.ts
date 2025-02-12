export const TASK_STATUS = {
  NOT_STARTED: 'not-started',
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const TASK_STATUS_VALUES = Object.values(TASK_STATUS);

export const TASK_TYPE = {
  CONSTRUCTION: 'construction',
  PROCUREMENT: 'procurement',
  INSPECTION: 'inspection'
} as const;

export type TaskType = typeof TASK_TYPE[keyof typeof TASK_TYPE];

export const TASK_TYPE_VALUES = Object.values(TASK_TYPE); 