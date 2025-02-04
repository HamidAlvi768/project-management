export const PHASE_STATUS = {
  NOT_STARTED: 'not-started',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
} as const;

export type PhaseStatus = typeof PHASE_STATUS[keyof typeof PHASE_STATUS];

export const PHASE_STATUS_VALUES = Object.values(PHASE_STATUS); 