// Project Status enum
export type ProjectStatus = 'not-started' | 'ongoing' | 'completed' | 'on-hold' | 'cancelled';

// Phase Status enum
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';

// Task Status enum
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

// Task Priority enum
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Task Type enum
export type TaskType = 'construction' | 'procurement' | 'inspection';

// Project interface
export interface IProject {
  _id: string;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  description: string;
  completion: number;
  stakeholders: string[];
  phaseCount: number;
  taskCount: number;
  budgetVariance: number;
  createdAt: string;
  updatedAt: string;
}

// Project Input interface
export interface IProjectInput {
  name: string;
  estimatedBudget: number;
  startDate: string;
  endDate: string;
  status?: ProjectStatus;
  description: string;
  stakeholders?: string[];
}

// Phase interface
export interface IPhase {
  _id: string;
  project: string;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: PhaseStatus;
  description: string;
  completion: number;
  taskCount: number;
  budgetVariance: number;
  laborCost: number;
  materialCost: number;
  equipmentCost: number;
  dependencies: string[];
  createdAt: string;
  updatedAt: string;
}

// Phase Input interface
export interface IPhaseInput {
  name: string;
  estimatedBudget: number;
  startDate: string;
  endDate: string;
  status?: PhaseStatus;
  description: string;
  laborCost?: number;
  materialCost?: number;
  equipmentCost?: number;
  dependencies?: string[];
}

// Task interface
export interface ITask {
  _id: string;
  phase: string;
  name: string;
  estimatedCost: number;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  description: string;
  type: TaskType;
  assignedTo: string;
  createdAt: string;
  updatedAt: string;
}

// Task Input interface
export interface ITaskInput {
  name: string;
  estimatedCost: number;
  startDate: string;
  endDate: string;
  status: TaskStatus;
  description: string;
  type: TaskType;
  assignedTo: string;
}

// API Response interface
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

// Project Timeline interface
export interface IProjectTimeline {
  _id: string;
  name: string;
  startDate: string;
  endDate: string;
  phases: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: PhaseStatus;
    completion: number;
    tasks: {
      _id: string;
      name: string;
      startDate: string;
      endDate: string;
      status: TaskStatus;
      completion: number;
    }[];
  }[];
}

// Project Stats interface
export interface IProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onHoldProjects: number;
  totalBudget: number;
  totalActualCost: number;
  averageCompletion: number;
  projectsByStatus: {
    status: ProjectStatus;
    count: number;
  }[];
  budgetVariance: number;
  phaseCount: number;
  taskCount: number;
} 