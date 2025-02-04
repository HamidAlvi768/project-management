import { ProjectStatus } from './types';

const BASE_URL = 'http://localhost:5000/api';

// Project interface matching backend model
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

// Project creation/update interface
export interface IProjectInput {
  name: string;
  estimatedBudget: number;
  startDate: string;
  endDate: string;
  status?: ProjectStatus;
  description: string;
  stakeholders?: string[];
}

// API response interface
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    total: number;
    page: number;
    pages: number;
  };
}

// Error handling helper
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

export const projectApi = {
  // Get all projects with pagination
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<IProject[]>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects?page=${page}&limit=${limit}`)
    );
  },

  // Get single project
  getOne: async (id: string): Promise<ApiResponse<IProject>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${id}`)
    );
  },

  // Create project
  create: async (data: IProjectInput): Promise<ApiResponse<IProject>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Update project
  update: async (id: string, data: Partial<IProjectInput>): Promise<ApiResponse<IProject>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Delete project
  delete: async (id: string): Promise<ApiResponse<void>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${id}`, {
        method: 'DELETE'
      })
    );
  },

  // Get project timeline
  getTimeline: async (id: string): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${id}/timeline`)
    );
  },

  // Get project stats
  getStats: async (): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/stats`)
    );
  }
};

// Phase API endpoints
export const phaseApi = {
  // Get all phases for a project
  getAllForProject: async (projectId: string): Promise<ApiResponse<any[]>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${projectId}/phases`)
    );
  },

  // Get single phase
  getOne: async (projectId: string, phaseId: string): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`)
    );
  },

  // Create phase
  create: async (projectId: string, data: any): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${projectId}/phases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Update phase
  update: async (projectId: string, phaseId: string, data: any): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Delete phase
  delete: async (projectId: string, phaseId: string): Promise<ApiResponse<void>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`, {
        method: 'DELETE'
      })
    );
  }
};

// Task API endpoints
export const taskApi = {
  // Get all tasks for a phase
  getAllForPhase: async (projectId: string, phaseId: string): Promise<ApiResponse<any[]>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/phases/${phaseId}/tasks`)
    );
  },

  // Create task
  create: async (projectId: string, phaseId: string, data: any): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/phases/${phaseId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Update task
  update: async (projectId: string, phaseId: string, taskId: string, data: any): Promise<ApiResponse<any>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/phases/${phaseId}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Delete task
  delete: async (projectId: string, phaseId: string, taskId: string): Promise<ApiResponse<void>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/phases/${phaseId}/tasks/${taskId}`, {
        method: 'DELETE'
      })
    );
  }
}; 