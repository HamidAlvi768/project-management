import { 
  ProjectStatus, 
  IProject, 
  IProjectInput, 
  ICustomer, 
  ICustomerInput, 
  IInventory, 
  IInventoryInput, 
  ITaskInventory, 
  ITaskInventoryInput,
  ApiResponse,
  IPhase,
  IPhaseInput,
  ITask,
  ITaskInput
} from './types';
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Error handling helper
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'An error occurred');
  }
  const data = await response.json();
  console.log('handleResponse parsed data:', data);
  
  // If the response is already in the correct format, return it as is
  if (data && typeof data === 'object' && 'success' in data) {
    return data as T;
  }
  
  // Otherwise, wrap it in our API response format
  return {
    success: true,
    data,
    message: 'Success'
  } as T;
};

// Project API endpoints
export const projectApi = {
  // Get all projects with pagination
  getAll: async (page = 1, limit = 10): Promise<ApiResponse<IProject[]>> => {
    const response = await fetch(`${BASE_URL}/projects?page=${page}&limit=${limit}`);
    const data = await response.json();
    console.log('API Response:', data);
    
    if (!data.status || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to fetch projects');
    }
    
    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message,
      pagination: data.pagination
    };
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
  getAllForProject: async (projectId: string): Promise<ApiResponse<IPhase[]>> => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/phases`);
    const data = await response.json();
    console.log('Phase API Response:', data);
    
    if (!data.status || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to fetch phases');
    }
    
    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message,
      pagination: data.pagination
    };
  },

  // Get single phase
  getOne: async (projectId: string, phaseId: string): Promise<ApiResponse<IPhase>> => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`);
    const data = await response.json();
    
    if (!data.status || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to fetch phase');
    }
    
    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message
    };
  },

  // Create phase
  create: async (projectId: string, data: IPhaseInput): Promise<ApiResponse<IPhase>> => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/phases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    
    if (!responseData.status || responseData.status !== 'success' || !responseData.data) {
      throw new Error(responseData.message || 'Failed to create phase');
    }
    
    return {
      success: responseData.status === 'success',
      data: responseData.data,
      message: responseData.message
    };
  },

  // Update phase
  update: async (projectId: string, phaseId: string, data: Partial<IPhaseInput>): Promise<ApiResponse<IPhase>> => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    
    if (!responseData.status || responseData.status !== 'success' || !responseData.data) {
      throw new Error(responseData.message || 'Failed to update phase');
    }
    
    return {
      success: responseData.status === 'success',
      data: responseData.data,
      message: responseData.message
    };
  },

  // Delete phase
  delete: async (projectId: string, phaseId: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${BASE_URL}/projects/${projectId}/phases/${phaseId}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    
    if (!data.status || data.status !== 'success') {
      throw new Error(data.message || 'Failed to delete phase');
    }
    
    return {
      success: data.status === 'success',
      data: undefined,
      message: data.message
    };
  }
};

// Task API endpoints
export const taskApi = {
  // Get all tasks for a phase
  getAllForPhase: async (projectId: string, phaseId: string): Promise<ApiResponse<ITask[]>> => {
    const response = await fetch(`${BASE_URL}/phases/${phaseId}/tasks`);
    const data = await response.json();
    console.log('Task API Response:', data);
    
    if (!data.status || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to fetch tasks');
    }
    
    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message,
      pagination: data.pagination
    };
  },

  // Get single task
  getOne: async (projectId: string, phaseId: string, taskId: string): Promise<ApiResponse<ITask>> => {
    const response = await fetch(`${BASE_URL}/phases/${phaseId}/tasks/${taskId}`);
    const data = await response.json();
    
    if (!data.status || data.status !== 'success' || !data.data) {
      throw new Error(data.message || 'Failed to fetch task');
    }
    
    return {
      success: data.status === 'success',
      data: data.data,
      message: data.message
    };
  },

  // Create task
  create: async (projectId: string, phaseId: string, data: ITaskInput): Promise<ApiResponse<ITask>> => {
    const response = await fetch(`${BASE_URL}/phases/${phaseId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    
    if (!responseData.status || responseData.status !== 'success' || !responseData.data) {
      throw new Error(responseData.message || 'Failed to create task');
    }
    
    return {
      success: responseData.status === 'success',
      data: responseData.data,
      message: responseData.message
    };
  },

  // Update task
  update: async (projectId: string, phaseId: string, taskId: string, data: Partial<ITaskInput>): Promise<ApiResponse<ITask>> => {
    const response = await fetch(`${BASE_URL}/phases/${phaseId}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    
    if (!responseData.status || responseData.status !== 'success' || !responseData.data) {
      throw new Error(responseData.message || 'Failed to update task');
    }
    
    return {
      success: responseData.status === 'success',
      data: responseData.data,
      message: responseData.message
    };
  },

  // Delete task
  delete: async (projectId: string, phaseId: string, taskId: string): Promise<ApiResponse<void>> => {
    const response = await fetch(`${BASE_URL}/phases/${phaseId}/tasks/${taskId}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    
    if (!data.status || data.status !== 'success') {
      throw new Error(data.message || 'Failed to delete task');
    }
    
    return {
      success: data.status === 'success',
      data: undefined,
      message: data.message
    };
  }
};

// Customer API functions
export const getCustomers = async (params?: { status?: string; search?: string }): Promise<ApiResponse<ICustomer[]>> => {
  console.log('Fetching customers with params:', params);
  const response = await fetch(`${BASE_URL}/customers${params ? `?${new URLSearchParams(params)}` : ''}`);
  const data = await handleResponse<ApiResponse<ICustomer[]>>(response);
  console.log('Customer API Response:', data);
  return data;
};

export const getCustomer = async (id: string): Promise<ApiResponse<ICustomer>> => {
  console.log('Fetching customer:', id);
  const response = await fetch(`${BASE_URL}/customers/${id}`);
  const data = await handleResponse<ApiResponse<ICustomer>>(response);
  console.log('Customer API Response:', data);
  return data;
};

export const createCustomer = async (customerData: ICustomerInput): Promise<ApiResponse<ICustomer>> => {
  console.log('Creating customer:', customerData);
  const response = await fetch(`${BASE_URL}/customers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  const data = await handleResponse<ApiResponse<ICustomer>>(response);
  console.log('Customer creation response:', data);
  return data;
};

export const updateCustomer = async (id: string, customerData: Partial<ICustomerInput>): Promise<ApiResponse<ICustomer>> => {
  console.log('Updating customer:', id, customerData);
  const response = await fetch(`${BASE_URL}/customers/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(customerData),
  });
  const data = await handleResponse<ApiResponse<ICustomer>>(response);
  console.log('Customer update response:', data);
  return data;
};

export const deleteCustomer = async (id: string): Promise<ApiResponse<void>> => {
  console.log('Deleting customer:', id);
  const response = await fetch(`${BASE_URL}/customers/${id}`, {
    method: 'DELETE',
  });
  const data = await handleResponse<ApiResponse<void>>(response);
  console.log('Customer deletion response:', data);
  return data;
};

// Inventory API endpoints
export const inventoryApi = {
  // Get all inventory items
  getAll: async (params?: { search?: string }): Promise<ApiResponse<IInventory[]>> => {
    try {
      const response = await fetch(`${BASE_URL}/inventory${params?.search ? `?search=${params.search}` : ''}`);
      return handleResponse<ApiResponse<IInventory[]>>(response);
    } catch (error) {
      throw error;
    }
  },

  // Get single inventory item
  getOne: async (id: string): Promise<ApiResponse<IInventory>> => {
    const response = await fetch(`${BASE_URL}/inventory/${id}`);
    return handleResponse(response);
  },

  // Create inventory item
  create: async (data: IInventoryInput): Promise<ApiResponse<IInventory>> => {
    const response = await fetch(`${BASE_URL}/inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Update inventory item
  update: async (id: string, data: Partial<IInventoryInput>): Promise<ApiResponse<IInventory>> => {
    const response = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },

  // Delete inventory item
  delete: async (id: string): Promise<ApiResponse<string>> => {
    const response = await fetch(`${BASE_URL}/inventory/${id}`, {
      method: 'DELETE'
    });
    return handleResponse(response);
  }
};

// Task Inventory API endpoints
export const taskInventoryApi = {
  // Get all inventory items for a task
  getAllForTask: async (taskId: string): Promise<ApiResponse<ITaskInventory[]>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/tasks/${taskId}/inventory`)
    );
  },

  // Add inventory to task
  addToTask: async (taskId: string, data: ITaskInventoryInput): Promise<ApiResponse<ITaskInventory>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/tasks/${taskId}/inventory`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Update task inventory
  update: async (taskId: string, inventoryId: string, data: Partial<ITaskInventoryInput>): Promise<ApiResponse<ITaskInventory>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/tasks/${taskId}/inventory/${inventoryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
    );
  },

  // Delete task inventory
  delete: async (taskId: string, inventoryId: string): Promise<ApiResponse<void>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/tasks/${taskId}/inventory/${inventoryId}`, {
        method: 'DELETE'
      })
    );
  },

  // Update consumed value
  updateConsumed: async (taskId: string, inventoryId: string, consumedValue: number): Promise<ApiResponse<ITaskInventory>> => {
    return handleResponse(
      await fetch(`${BASE_URL}/tasks/${taskId}/inventory/${inventoryId}/consume`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consumedValue })
      })
    );
  }
}; 