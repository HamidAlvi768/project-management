import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { IProject, IProjectInput } from '../../services/types';
import { projectApi } from '../../services/api';

interface ProjectState {
  projects: IProject[];
  selectedProject: IProject | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching projects
export const fetchProjects = createAsyncThunk(
  'project/fetchProjects',
  async () => {
    console.log('Fetching projects...');
    const response = await projectApi.getAll();
    console.log('Raw API response:', response);
    
    if (!response.success) {
      throw new Error(response.message || 'Failed to fetch projects');
    }

    if (!response.data || !Array.isArray(response.data)) {
      console.error('Invalid data format:', response.data);
      throw new Error('Invalid data format received from API');
    }

    return response.data;
  }
);

// Async thunk for creating a project
export const createProject = createAsyncThunk(
  'project/createProject',
  async (data: IProjectInput) => {
    try {
      const response = await projectApi.create(data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for updating a project
export const updateProject = createAsyncThunk(
  'project/updateProject',
  async ({ projectId, data }: { projectId: string; data: Partial<IProjectInput> }) => {
    try {
      const response = await projectApi.update(projectId, data);
      if (!response.success) {
        throw new Error(response.message || 'Failed to update project');
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Async thunk for deleting a project
export const deleteProject = createAsyncThunk(
  'project/deleteProject',
  async (projectId: string) => {
    try {
      await projectApi.delete(projectId);
      return projectId;
    } catch (error) {
      throw error;
    }
  }
);

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setSelectedProject: (state, action: PayloadAction<IProject | null>) => {
      state.selectedProject = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedProject', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('selectedProject');
      }
    },
    loadFromLocalStorage: (state) => {
      const cachedProjects = localStorage.getItem('projects');
      const cachedSelectedProject = localStorage.getItem('selectedProject');
      
      if (cachedProjects) {
        state.projects = JSON.parse(cachedProjects);
      }
      if (cachedSelectedProject) {
        state.selectedProject = JSON.parse(cachedSelectedProject);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.isLoading = false;
        state.projects = action.payload;
        localStorage.setItem('projects', JSON.stringify(action.payload));
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      // Create project
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
        localStorage.setItem('projects', JSON.stringify(state.projects));
      })
      // Update project
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project._id === action.payload._id);
        if (index !== -1) {
          state.projects[index] = action.payload;
          if (state.selectedProject?._id === action.payload._id) {
            state.selectedProject = action.payload;
          }
          localStorage.setItem('projects', JSON.stringify(state.projects));
        }
      })
      // Delete project
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project._id !== action.payload);
        localStorage.setItem('projects', JSON.stringify(state.projects));
      });
  },
});

export const { setSelectedProject, loadFromLocalStorage } = projectSlice.actions;
export default projectSlice.reducer; 