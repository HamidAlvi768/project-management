import { configureStore } from '@reduxjs/toolkit';
import customerReducer from './slices/customerSlice';
import projectReducer from './slices/projectSlice';
import phaseReducer from './slices/phaseSlice';
import taskReducer from './slices/taskSlice';
import inventoryReducer from './slices/inventorySlice';

export const store = configureStore({
  reducer: {
    customer: customerReducer,
    project: projectReducer,
    phase: phaseReducer,
    task: taskReducer,
    inventory: inventoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 