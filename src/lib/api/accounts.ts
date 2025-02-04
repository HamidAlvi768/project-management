import axios from 'axios';

const API_URL = 'http://localhost/react/expensemanager/accounts/api.php';

export interface Account {
  id: string;
  account_title: string;
  account_type: string;
  deposit: string;
  balance: string;
  withdrawal: string;
  total: string;
  notes: string;
}

export interface CreateAccountData {
  account_title: string;
  account_type: string;
  deposit: string;
  balance: string;
  withdrawal: string;
  total: string;
  notes: string;
}

export interface UpdateAccountData extends CreateAccountData {}

export interface AccountFilters {
  account_type?: string;
  account_title?: string;
  min_balance?: number;
  max_balance?: number;
}

export const accountsApi = {
  // Get all accounts
  getAll: async (filters?: AccountFilters): Promise<Account[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const url = `${API_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await axios.get(url);
    return response.data;
  },

  // Get single account
  getById: async (id: string): Promise<Account> => {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data;
  },

  // Create account
  create: async (data: CreateAccountData): Promise<Account> => {
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // Update account
  update: async (id: string, data: UpdateAccountData): Promise<Account> => {
    const response = await axios.put(`${API_URL}?id=${id}`, data);
    return response.data;
  },

  // Delete account
  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}?id=${id}`);
  },
}; 