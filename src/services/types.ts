// Project Status enum
export type ProjectStatus = 'not-started' | 'ongoing' | 'completed' | 'on-hold' | 'cancelled';

// Phase Status enum
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed' | 'on-hold' | 'cancelled';

// Task Status enum
export type TaskStatus = 'not-started' | 'pending' | 'in-progress' | 'completed';

// Task Priority enum
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

// Task Type enum
export type TaskType = 'construction' | 'procurement' | 'inspection';

// Customer Status enum
export type CustomerStatus = 'new' | 'contracted' | 'pending' | 'inactive';

// Inventory Unit Type
export type InventoryUnit = 'pieces' | 'kg' | 'liters' | 'meters' | 'square_meters' | 'cubic_meters' | 'custom';

// Project interface
export interface IProject {
  _id: string;
  name: string;
  customer: string | { _id: string; name: string };  // Can be either customer ID or populated customer object
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
  customer: string;  // When creating/updating, we only send the customer ID
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
  inventory?: ITaskInventory[];
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

// Customer interface
export interface ICustomer {
  _id: string;
  name: string;
  phoneNumber: string;
  address: string;
  status: CustomerStatus;
  email?: string;
  notes?: string;
  projects?: string[];
  createdAt: string;
  updatedAt: string;
}

// Customer Input interface
export interface ICustomerInput {
  name: string;
  phoneNumber: string;
  address: string;
  status: CustomerStatus;
  email?: string;
  notes?: string;
}

// Inventory interface
export interface IInventory {
  _id: string;
  name: string;
  description: string;
  unit: InventoryUnit;
  unitValue: number;
  pricePerUnit: number;
  totalPrice: number;
  remainingValue: number;
  customUnit?: string;
  createdAt: string;
  updatedAt: string;
}

// Inventory Input interface
export interface IInventoryInput {
  name: string;
  description: string;
  unit: InventoryUnit;
  unitValue: number;
  pricePerUnit: number;
  customUnit?: string;
}

// Task Inventory interface
export interface ITaskInventory {
  _id: string;
  task: string;
  phase: string;
  project: string;
  customer: string;
  inventory: IInventory;
  allocatedValue: number;
  consumedValue: number;
  remainingValue: number;
  createdAt: string;
  updatedAt: string;
}

// Task Inventory Input interface
export interface ITaskInventoryInput {
  task: string;
  phase: string;
  project: string;
  customer: string;
  inventory: string; // inventory ID
  allocatedValue: number;
} 