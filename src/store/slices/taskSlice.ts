import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ITask, ITaskInput } from '../../services/types';
import { taskApi } from '../../services/api';

interface TaskState {
  tasks: ITask[];
  selectedTask: ITask | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  selectedTask: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching tasks
export const fetchTasks = createAsyncThunk(
  'task/fetchTasks',
  async ({ projectId, phaseId }: { projectId: string; phaseId: string }) => {
    console.log('Fetching tasks for phase:', phaseId);
    try {
      const response = await taskApi.getAllForPhase(projectId, phaseId);
      console.log('Raw API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch tasks');
      }
      
      if (!Array.isArray(response.data)) {
        console.log('Invalid data format:', response.data);
        throw new Error('Invalid response format: expected an array of tasks');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Task fetch error:', error.message);
      throw error;
    }
  }
);

// Async thunk for creating a task
export const createTask = createAsyncThunk(
  'task/createTask',
  async ({ projectId, phaseId, data }: { projectId: string; phaseId: string; data: ITaskInput }) => {
    try {
      const response = await taskApi.create(projectId, phaseId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create task');
      }
      return response.data;
    } catch (error: any) {
      console.error('Task creation error:', error.message);
      throw error;
    }
  }
);

// Async thunk for updating a task
export const updateTask = createAsyncThunk(
  'task/updateTask',
  async ({ projectId, phaseId, taskId, data }: { projectId: string; phaseId: string; taskId: string; data: Partial<ITaskInput> }) => {
    try {
      const response = await taskApi.update(projectId, phaseId, taskId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update task');
      }
      return response.data;
    } catch (error: any) {
      console.error('Task update error:', error.message);
      throw error;
    }
  }
);

// Async thunk for deleting a task
export const deleteTask = createAsyncThunk(
  'task/deleteTask',
  async ({ projectId, phaseId, taskId }: { projectId: string; phaseId: string; taskId: string }) => {
    try {
      const response = await taskApi.delete(projectId, phaseId, taskId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete task');
      }
      return taskId;
    } catch (error: any) {
      console.error('Task deletion error:', error.message);
      throw error;
    }
  }
);

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    setSelectedTask: (state, action: PayloadAction<ITask | null>) => {
      state.selectedTask = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedTask', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('selectedTask');
      }
    },
    loadFromLocalStorage: (state) => {
      const cachedTasks = localStorage.getItem('tasks');
      const cachedSelectedTask = localStorage.getItem('selectedTask');
      
      if (cachedTasks) {
        state.tasks = JSON.parse(cachedTasks);
      }
      if (cachedSelectedTask) {
        state.selectedTask = JSON.parse(cachedSelectedTask);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
        localStorage.setItem('tasks', JSON.stringify(action.payload));
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      // Create task
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      })
      // Update task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
          localStorage.setItem('tasks', JSON.stringify(state.tasks));
        }
      })
      // Delete task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      });
  },
});

export const { setSelectedTask, loadFromLocalStorage } = taskSlice.actions;
export default taskSlice.reducer; 