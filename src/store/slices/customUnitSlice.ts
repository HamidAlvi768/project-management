import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICustomUnit, ICustomUnitInput } from '../../services/types';
import { customUnitApi } from '../../services/api';

interface CustomUnitState {
  units: ICustomUnit[];
  selectedUnit: ICustomUnit | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomUnitState = {
  units: [],
  selectedUnit: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchCustomUnits = createAsyncThunk(
  'customUnit/fetchCustomUnits',
  async (params?: { search?: string; active?: boolean }) => {
    const response = await customUnitApi.getAll(params);
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch custom units');
    }
    return response.data;
  }
);

export const createCustomUnit = createAsyncThunk(
  'customUnit/createCustomUnit',
  async (data: ICustomUnitInput) => {
    const response = await customUnitApi.create(data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to create custom unit');
    }
    return response.data;
  }
);

export const updateCustomUnit = createAsyncThunk(
  'customUnit/updateCustomUnit',
  async ({ id, data }: { id: string; data: Partial<ICustomUnitInput> }) => {
    const response = await customUnitApi.update(id, data);
    if (!response.success) {
      throw new Error(response.message || 'Failed to update custom unit');
    }
    return response.data;
  }
);

export const deleteCustomUnit = createAsyncThunk(
  'customUnit/deleteCustomUnit',
  async (id: string) => {
    const response = await customUnitApi.delete(id);
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete custom unit');
    }
    return id;
  }
);

const customUnitSlice = createSlice({
  name: 'customUnit',
  initialState,
  reducers: {
    setSelectedUnit: (state, action: PayloadAction<ICustomUnit | null>) => {
      state.selectedUnit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch custom units
      .addCase(fetchCustomUnits.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomUnits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.units = action.payload;
      })
      .addCase(fetchCustomUnits.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch custom units';
      })
      // Create custom unit
      .addCase(createCustomUnit.fulfilled, (state, action) => {
        state.units.push(action.payload);
      })
      // Update custom unit
      .addCase(updateCustomUnit.fulfilled, (state, action) => {
        const index = state.units.findIndex(unit => unit._id === action.payload._id);
        if (index !== -1) {
          state.units[index] = action.payload;
        }
      })
      // Delete custom unit
      .addCase(deleteCustomUnit.fulfilled, (state, action) => {
        state.units = state.units.filter(unit => unit._id !== action.payload);
      });
  },
});

export const { setSelectedUnit } = customUnitSlice.actions;
export default customUnitSlice.reducer; 