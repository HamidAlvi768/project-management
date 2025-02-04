import * as React from "react"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { toast } from "sonner"

import { BasePage } from "@/components/ui/base-page"
import { FormField } from "@/components/forms/data-form"
import { FilterOption } from "@/components/ui/filter-sidebar"
import { incomesService, type Income } from "@/services/incomesService"

// Sample data for accounts and categories
const accounts = [
  { value: "savings", label: "Savings Account" },
  { value: "checking", label: "Checking Account" },
  { value: "investment", label: "Investment Account" },
]

const categories = [
  { value: "salary", label: "Salary" },
  { value: "investment", label: "Investment Returns" },
  { value: "freelance", label: "Freelance" },
  { value: "other", label: "Other" },
]

// Table columns definition
const columns: ColumnDef<Income>[] = [
  {
    accessorKey: "account",
    header: "Account",
    cell: ({ row }) => {
      const account = accounts.find(a => a.value === row.original.account)
      return account?.label || row.original.account
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = categories.find(c => c.value === row.original.category)
      return category?.label || row.original.category
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(row.original.amount)
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      try {
        const date = new Date(row.original.date);
        if (isNaN(date.getTime())) {
          return row.original.date;
        }
        return format(date, "MMM dd, yyyy");
      } catch (error) {
        return row.original.date;
      }
    },
  },
]

// Form fields for Add/Edit
const formFields: FormField[] = [
  {
    type: 'select',
    label: 'Account',
    key: 'account',
    options: accounts,
    required: true,
  },
  {
    type: 'select',
    label: 'Category',
    key: 'category',
    options: categories,
    required: true,
  },
  {
    type: 'number',
    label: 'Amount',
    key: 'amount',
    placeholder: 'Enter Amount',
    required: true,
  },
  {
    type: 'date',
    label: 'Date',
    key: 'date',
    required: true,
  },
  {
    type: 'textarea',
    label: 'Description',
    key: 'description',
    placeholder: 'Enter description',
    required: true,
  },
]

// Filter options
const filterOptions: FilterOption[] = [
  {
    key: "account",
    label: "Account",
    type: "select",
    options: accounts,
  },
  {
    key: "category",
    label: "Income Category",
    type: "select",
    options: categories,
  },
  {
    key: "startDate",
    label: "Start Date",
    type: "date",
  },
  {
    key: "endDate",
    label: "End Date",
    type: "date",
  },
]

export default function IncomesPage() {
  const [data, setData] = React.useState<Income[]>([]);
  const [loading, setLoading] = React.useState(true);

  const loadIncomes = async (filters?: Record<string, any>) => {
    try {
      setLoading(true);
      const incomes = await incomesService.getAllIncomes(filters);
      setData(incomes);
    } catch (error) {
      console.error('Error loading incomes:', error);
      toast.error('Failed to load incomes');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadIncomes();
  }, []);

  const handleAdd = async (formData: Record<string, any>) => {
    try {
      await incomesService.createIncome({
        account: formData.account,
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date instanceof Date ? format(formData.date, 'yyyy-MM-dd') : formData.date,
      });
      toast.success('Income created successfully');
      loadIncomes();
    } catch (error) {
      console.error('Error creating income:', error);
      toast.error('Failed to create income');
    }
  };

  const handleEdit = async (formData: Record<string, any>) => {
    try {
      if (!formData.id) {
        toast.error('Income ID is missing');
        return;
      }
      await incomesService.updateIncome(formData.id, {
        id: formData.id,
        account: formData.account,
        category: formData.category,
        amount: Number(formData.amount),
        description: formData.description,
        date: formData.date instanceof Date ? format(formData.date, 'yyyy-MM-dd') : formData.date,
      });
      toast.success('Income updated successfully');
      loadIncomes();
    } catch (error) {
      console.error('Error updating income:', error);
      toast.error('Failed to update income');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await incomesService.deleteIncome(Number(id));
      toast.success('Income deleted successfully');
      loadIncomes();
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  const handleFilter = (filters: Record<string, any>) => {
    loadIncomes(filters);
  };

  return (
    <BasePage<Income>
      title="Incomes"
      data={data}
      columns={columns}
      filterOptions={filterOptions}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onFilter={handleFilter}
      loading={loading}
    />
  );
} 