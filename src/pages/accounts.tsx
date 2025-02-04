import * as React from "react"
import { useState, useEffect } from "react"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { BasePage } from "@/components/ui/base-page"
import type { FilterOption } from "@/components/ui/filter-sidebar"
import type { FormField } from "@/components/forms/data-form"
import { accountsApi, type Account, type AccountFilters } from "@/lib/api/accounts"
import { toast } from "sonner"

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "account_title",
    header: "Account Title",
    size: 200,
    enableSorting: true,
  },
  {
    accessorKey: "account_type",
    header: "Account Type",
    size: 150,
    enableSorting: true,
  },
  {
    accessorKey: "deposit",
    header: "Deposit",
    size: 120,
    enableSorting: true,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as string;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(value))
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    size: 120,
    enableSorting: true,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as string;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(value))
    },
  },
  {
    accessorKey: "withdrawal",
    header: "Withdrawal",
    size: 120,
    enableSorting: true,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as string;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(value))
    },
  },
  {
    accessorKey: "total",
    header: "Total",
    size: 120,
    enableSorting: true,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as string;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(parseFloat(value))
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    size: 200,
  }
]

const filterOptions: FilterOption[] = [
  {
    type: 'input',
    label: 'Account Title',
    key: 'account_title',
    placeholder: 'Enter account title',
  },
  {
    type: 'select',
    label: 'Account Type',
    key: 'account_type',
    options: [
      { label: 'Cash', value: 'Cash' },
      { label: 'Bank', value: 'Bank' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'Digital Wallet', value: 'Digital Wallet' },
    ],
  },
]

const formFields: FormField[] = [
  {
    type: 'input',
    label: 'Account Title',
    key: 'account_title',
    placeholder: 'Enter account title',
    required: true,
  },
  {
    type: 'select',
    label: 'Account Type',
    key: 'account_type',
    options: [
      { label: 'Cash', value: 'Cash' },
      { label: 'Bank', value: 'Bank' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'Digital Wallet', value: 'Digital Wallet' },
    ],
    required: true,
  },
  {
    type: 'input',
    label: 'Deposit',
    key: 'deposit',
    placeholder: 'Enter deposit amount',
    required: true,
  },
  {
    type: 'input',
    label: 'Balance',
    key: 'balance',
    placeholder: 'Enter balance amount',
    required: true,
  },
  {
    type: 'input',
    label: 'Withdrawal',
    key: 'withdrawal',
    placeholder: 'Enter withdrawal amount',
    required: true,
  },
  {
    type: 'input',
    label: 'Total',
    key: 'total',
    placeholder: 'Enter total amount',
    required: true,
  },
  {
    type: 'textarea',
    label: 'Notes',
    key: 'notes',
    placeholder: 'Enter notes (optional)',
  },
]

export const AccountsPage: React.FC = () => {
  const [data, setData] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AccountFilters>({});

  const loadAccounts = async (filters?: AccountFilters) => {
    try {
      setLoading(true);
      const accounts = await accountsApi.getAll(filters);
      console.log('Loaded accounts:', accounts);
      setData(accounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
      toast.error('Failed to load accounts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccounts(filters);
  }, [filters]);

  const handleAdd = async (formData: Record<string, any>) => {
    try {
      await accountsApi.create({
        account_title: formData.account_title,
        account_type: formData.account_type,
        deposit: formData.deposit,
        balance: formData.balance,
        withdrawal: formData.withdrawal,
        total: formData.total,
        notes: formData.notes || '',
      });
      toast.success('Account created successfully');
      loadAccounts();
    } catch (error) {
      console.error('Error creating account:', error);
      toast.error('Failed to create account');
    }
  };

  const handleEdit = async (formData: Record<string, any>) => {
    try {
      if (!formData.id) {
        toast.error('Account ID is missing');
        return;
      }
      await accountsApi.update(formData.id.toString(), {
        account_title: formData.account_title,
        account_type: formData.account_type,
        deposit: formData.deposit,
        balance: formData.balance,
        withdrawal: formData.withdrawal,
        total: formData.total,
        notes: formData.notes || '',
      });
      toast.success('Account updated successfully');
      loadAccounts();
    } catch (error) {
      console.error('Error updating account:', error);
      toast.error('Failed to update account');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      if (!id) {
        toast.error('Account ID is missing');
        return;
      }
      await accountsApi.delete(id.toString());
      toast.success('Account deleted successfully');
      loadAccounts();
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  const handleFilter = async (newFilters: Record<string, any>) => {
    // Transform the filters to match our API expectations
    const transformedFilters: AccountFilters = {
      account_type: newFilters.account_type,
      account_title: newFilters.account_title,
      min_balance: newFilters.min_balance ? parseFloat(newFilters.min_balance) : undefined,
      max_balance: newFilters.max_balance ? parseFloat(newFilters.max_balance) : undefined,
    };

    // Update filters state which will trigger a reload
    setFilters(transformedFilters);
  };

  return (
    <BasePage
      title="Accounts"
      columns={columns}
      data={data}
      loading={loading}
      filterOptions={filterOptions}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onFilter={handleFilter}
    />
  );
};