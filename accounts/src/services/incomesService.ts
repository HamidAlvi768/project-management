import axios from 'axios';

const API_URL = 'http://localhost/react/expensemanager/incomes/api.php';

export interface Income {
  id?: number;
  account: string;
  category: string;
  amount: number;
  description: string;
  date: string;
}

export interface IncomeFilters {
  account?: string;
  category?: string;
  startDate?: string;
  endDate?: string;
}

export const incomesService = {
  getAllIncomes: async (filters?: IncomeFilters): Promise<Income[]> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, value.toString());
        }
      });
    }
    const response = await axios.get(`${API_URL}${params.toString() ? `?${params.toString()}` : ''}`);
    return response.data;
  },

  getIncome: async (id: number): Promise<Income> => {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data;
  },

  createIncome: async (income: Omit<Income, 'id'>): Promise<{ message: string }> => {
    const response = await axios.post(API_URL, income);
    return response.data;
  },

  updateIncome: async (id: number, income: Income): Promise<{ message: string }> => {
    const response = await axios.put(`${API_URL}?id=${id}`, income);
    return response.data;
  },

  deleteIncome: async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}?id=${id}`);
    return response.data;
  },
}; 