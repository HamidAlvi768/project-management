export const PROJECT_STATUS = {
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ON_HOLD: 'on-hold'
} as const;

export type ProjectStatus = typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

export const PROJECT_STATUS_VALUES = Object.values(PROJECT_STATUS); 