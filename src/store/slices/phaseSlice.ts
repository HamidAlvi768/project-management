import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IPhase, IPhaseInput } from '../../services/types';
import { phaseApi } from '../../services/api';

interface PhaseState {
  phases: IPhase[];
  selectedPhase: IPhase | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PhaseState = {
  phases: [],
  selectedPhase: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching phases
export const fetchPhases = createAsyncThunk(
  'phase/fetchPhases',
  async (projectId: string) => {
    console.log('Fetching phases for project:', projectId);
    try {
      const response = await phaseApi.getAllForProject(projectId);
      console.log('Raw API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch phases');
      }
      
      if (!Array.isArray(response.data)) {
        console.log('Invalid data format:', response.data);
        throw new Error('Invalid response format: expected an array of phases');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Phase fetch error:', error.message);
      throw error;
    }
  }
);

// Async thunk for creating a phase
export const createPhase = createAsyncThunk(
  'phase/createPhase',
  async ({ projectId, data }: { projectId: string; data: IPhaseInput }) => {
    try {
      const response = await phaseApi.create(projectId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to create phase');
      }
      return response.data;
    } catch (error: any) {
      console.error('Phase creation error:', error.message);
      throw error;
    }
  }
);

// Async thunk for updating a phase
export const updatePhase = createAsyncThunk(
  'phase/updatePhase',
  async ({ projectId, phaseId, data }: { projectId: string; phaseId: string; data: Partial<IPhaseInput> }) => {
    try {
      const response = await phaseApi.update(projectId, phaseId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update phase');
      }
      return response.data;
    } catch (error: any) {
      console.error('Phase update error:', error.message);
      throw error;
    }
  }
);

// Async thunk for deleting a phase
export const deletePhase = createAsyncThunk(
  'phase/deletePhase',
  async ({ projectId, phaseId }: { projectId: string; phaseId: string }) => {
    try {
      const response = await phaseApi.delete(projectId, phaseId);
      if (!response.success) {
        throw new Error(response.message || 'Failed to delete phase');
      }
      return phaseId;
    } catch (error: any) {
      console.error('Phase deletion error:', error.message);
      throw error;
    }
  }
);

const phaseSlice = createSlice({
  name: 'phase',
  initialState,
  reducers: {
    setSelectedPhase: (state, action: PayloadAction<IPhase | null>) => {
      state.selectedPhase = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedPhase', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('selectedPhase');
      }
    },
    loadFromLocalStorage: (state) => {
      const cachedPhases = localStorage.getItem('phases');
      const cachedSelectedPhase = localStorage.getItem('selectedPhase');
      
      if (cachedPhases) {
        state.phases = JSON.parse(cachedPhases);
      }
      if (cachedSelectedPhase) {
        state.selectedPhase = JSON.parse(cachedSelectedPhase);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch phases
      .addCase(fetchPhases.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPhases.fulfilled, (state, action) => {
        state.isLoading = false;
        state.phases = action.payload;
        localStorage.setItem('phases', JSON.stringify(action.payload));
      })
      .addCase(fetchPhases.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch phases';
      })
      // Create phase
      .addCase(createPhase.fulfilled, (state, action) => {
        state.phases.push(action.payload);
        localStorage.setItem('phases', JSON.stringify(state.phases));
      })
      // Update phase
      .addCase(updatePhase.fulfilled, (state, action) => {
        const index = state.phases.findIndex(phase => phase._id === action.payload._id);
        if (index !== -1) {
          state.phases[index] = action.payload;
          localStorage.setItem('phases', JSON.stringify(state.phases));
        }
      })
      // Delete phase
      .addCase(deletePhase.fulfilled, (state, action) => {
        state.phases = state.phases.filter(phase => phase._id !== action.payload);
        localStorage.setItem('phases', JSON.stringify(state.phases));
      });
  },
});

export const { setSelectedPhase, loadFromLocalStorage } = phaseSlice.actions;
export default phaseSlice.reducer; 