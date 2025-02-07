import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ICustomer } from '../../services/types';
import { getCustomers, getCustomer } from '../../services/api';

interface CustomerState {
  customers: ICustomer[];
  selectedCustomer: ICustomer | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CustomerState = {
  customers: [],
  selectedCustomer: null,
  isLoading: false,
  error: null,
};

// Async thunk for fetching customers
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async () => {
    console.log('Fetching customers...');
    try {
      const response = await getCustomers();
      console.log('Raw API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customers');
      }
      
      if (!Array.isArray(response.data)) {
        console.error('Invalid data format:', response.data);
        throw new Error('Invalid response format: expected an array of customers');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Customer fetch error:', error.message);
      throw error;
    }
  }
);

// Async thunk for fetching a single customer
export const fetchCustomer = createAsyncThunk(
  'customer/fetchCustomer',
  async (customerId: string) => {
    console.log('Fetching customer:', customerId);
    try {
      const response = await getCustomer(customerId);
      console.log('Raw API Response:', response);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to fetch customer');
      }
      
      if (!response.data || !response.data._id) {
        console.error('Invalid customer data:', response.data);
        throw new Error('Invalid customer data received');
      }
      
      return response.data;
    } catch (error: any) {
      console.error('Customer fetch error:', error.message);
      throw error;
    }
  }
);

const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    setSelectedCustomer: (state, action: PayloadAction<ICustomer | null>) => {
      state.selectedCustomer = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedCustomer', JSON.stringify(action.payload));
      } else {
        localStorage.removeItem('selectedCustomer');
      }
    },
    setCustomers: (state, action: PayloadAction<ICustomer[]>) => {
      state.customers = action.payload;
      localStorage.setItem('customers', JSON.stringify(action.payload));
    },
    loadFromLocalStorage: (state) => {
      const cachedCustomers = localStorage.getItem('customers');
      const cachedSelectedCustomer = localStorage.getItem('selectedCustomer');
      
      if (cachedCustomers) {
        state.customers = JSON.parse(cachedCustomers);
      }
      if (cachedSelectedCustomer) {
        state.selectedCustomer = JSON.parse(cachedSelectedCustomer);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.customers = action.payload;
        localStorage.setItem('customers', JSON.stringify(action.payload));
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customers';
      })
      .addCase(fetchCustomer.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCustomer.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCustomer = action.payload;
        // Update the customer in the customers array if it exists
        const index = state.customers.findIndex(c => c._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        } else {
          state.customers.push(action.payload);
        }
        localStorage.setItem('customers', JSON.stringify(state.customers));
        localStorage.setItem('selectedCustomer', JSON.stringify(action.payload));
      })
      .addCase(fetchCustomer.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch customer';
      });
  },
});

export const { setSelectedCustomer, setCustomers, loadFromLocalStorage } = customerSlice.actions;
export default customerSlice.reducer; 