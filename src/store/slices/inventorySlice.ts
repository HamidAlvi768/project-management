import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IInventory, IInventoryInput, ITaskInventory, ITaskInventoryInput } from '../../services/types';
import { inventoryApi, taskInventoryApi } from '../../services/api';

interface InventoryState {
  items: IInventory[];
  selectedInventory: IInventory | null;
  taskInventory: Record<string, ITaskInventory[]>; // Keyed by taskId
  isLoading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  items: [],
  selectedInventory: null,
  taskInventory: {},
  isLoading: false,
  error: null,
};

// Async thunks for inventory management
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (params?: { search?: string }) => {
    try {
      const response = await inventoryApi.getAll(params);
      console.log('Raw API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch inventory');
      }
      
      if (!Array.isArray(response.data)) {
        console.log('Invalid data format:', response.data);
        throw new Error('Invalid response format: expected an array of inventory items');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Inventory fetch error:', error.message);
      throw error;
    }
  }
);

export const createInventory = createAsyncThunk(
  'inventory/createInventory',
  async (data: IInventoryInput) => {
    try {
      const response = await inventoryApi.create(data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to create inventory');
    }
  }
);

export const updateInventory = createAsyncThunk(
  'inventory/updateInventory',
  async ({ id, data }: { id: string; data: Partial<IInventoryInput> }) => {
    try {
      const response = await inventoryApi.update(id, data);
      return response.data;
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update inventory');
    }
  }
);

export const deleteInventory = createAsyncThunk(
  'inventory/deleteInventory',
  async (id: string) => {
    try {
      const response = await inventoryApi.delete(id);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete inventory');
      }
      return response.data; // This will be the ID of the deleted item
    } catch (error: any) {
      throw new Error(error.message || 'Failed to delete inventory');
    }
  }
);

// Async thunks for task inventory management
export const fetchTaskInventory = createAsyncThunk(
  'inventory/fetchTaskInventory',
  async (taskId: string) => {
    try {
      const response = await taskInventoryApi.getAllForTask(taskId);
      return { taskId, data: response.data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to fetch task inventory');
    }
  }
);

export const addInventoryToTask = createAsyncThunk(
  'inventory/addInventoryToTask',
  async ({ taskId, data }: { taskId: string; data: ITaskInventoryInput }) => {
    try {
      const response = await taskInventoryApi.addToTask(taskId, data);
      return { taskId, data: response.data };
    } catch (error: any) {
      throw new Error(error.message || 'Failed to add inventory to task');
    }
  }
);

export const updateTaskInventory = createAsyncThunk(
  'inventory/updateTaskInventory',
  async ({ taskId, inventoryId, data }: { taskId: string; inventoryId: string; data: Partial<ITaskInventoryInput> }) => {
    try {
      const response = await taskInventoryApi.update(taskId, inventoryId, data);
      return { taskId, data: response.data };
    } catch (error) {
      throw error;
    }
  }
);

export const deleteTaskInventory = createAsyncThunk(
  'inventory/deleteTaskInventory',
  async ({ taskId, inventoryId }: { taskId: string; inventoryId: string }) => {
    try {
      await taskInventoryApi.delete(taskId, inventoryId);
      return { taskId, inventoryId };
    } catch (error) {
      throw error;
    }
  }
);

export const updateConsumedValue = createAsyncThunk(
  'inventory/updateConsumedValue',
  async ({ taskId, inventoryId, consumedValue }: { taskId: string; inventoryId: string; consumedValue: number }) => {
    try {
      const response = await taskInventoryApi.updateConsumed(taskId, inventoryId, consumedValue);
      return { taskId, data: response.data };
    } catch (error) {
      throw error;
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setSelectedInventory: (state, action: PayloadAction<IInventory | null>) => {
      state.selectedInventory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload || [];
        state.error = null;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch inventory';
      })
      // Create inventory
      .addCase(createInventory.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      // Update inventory
      .addCase(updateInventory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      // Delete inventory
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item._id !== action.payload);
      })
      // Fetch task inventory
      .addCase(fetchTaskInventory.fulfilled, (state, action) => {
        state.taskInventory[action.payload.taskId] = action.payload.data;
      })
      // Add inventory to task
      .addCase(addInventoryToTask.fulfilled, (state, action) => {
        const taskId = action.payload.taskId;
        if (!state.taskInventory[taskId]) {
          state.taskInventory[taskId] = [];
        }
        state.taskInventory[taskId].push(action.payload.data);
      })
      // Update task inventory
      .addCase(updateTaskInventory.fulfilled, (state, action) => {
        const taskId = action.payload.taskId;
        const index = state.taskInventory[taskId]?.findIndex(
          item => item._id === action.payload.data._id
        );
        if (index !== undefined && index !== -1) {
          state.taskInventory[taskId][index] = action.payload.data;
        }
      })
      // Delete task inventory
      .addCase(deleteTaskInventory.fulfilled, (state, action) => {
        const { taskId, inventoryId } = action.payload;
        if (state.taskInventory[taskId]) {
          state.taskInventory[taskId] = state.taskInventory[taskId].filter(
            item => item._id !== inventoryId
          );
        }
      })
      // Update consumed value
      .addCase(updateConsumedValue.fulfilled, (state, action) => {
        const taskId = action.payload.taskId;
        const index = state.taskInventory[taskId]?.findIndex(
          item => item._id === action.payload.data._id
        );
        if (index !== undefined && index !== -1) {
          state.taskInventory[taskId][index] = action.payload.data;
        }
      });
  },
});

export const { setSelectedInventory } = inventorySlice.actions;
export default inventorySlice.reducer; 