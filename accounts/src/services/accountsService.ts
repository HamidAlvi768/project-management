import axios from 'axios';

const API_URL = 'http://localhost/react/expensemanager/accounts/api.php';

export interface Account {
  id?: number;
  account_title: string;
  account_type: string;
  deposit: number;
  balance: number;
  withdrawal: number;
  total: number;
  notes: string;
}

export const accountsService = {
  getAllAccounts: async (): Promise<Account[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getAccount: async (id: number): Promise<Account> => {
    const response = await axios.get(`${API_URL}?id=${id}`);
    return response.data;
  },

  createAccount: async (account: Omit<Account, 'id'>): Promise<{ message: string }> => {
    const response = await axios.post(API_URL, account);
    return response.data;
  },

  updateAccount: async (id: number, account: Account): Promise<{ message: string }> => {
    const response = await axios.put(`${API_URL}?id=${id}`, account);
    return response.data;
  },

  deleteAccount: async (id: number): Promise<{ message: string }> => {
    const response = await axios.delete(`${API_URL}?id=${id}`);
    return response.data;
  },
};

export default accountsService; 