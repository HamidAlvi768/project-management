import * as React from "react"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { BasePage } from "@/components/ui/base-page"
import type { FilterOption } from "@/components/ui/filter-sidebar"
import type { FormField } from "@/components/forms/data-form"
import { accountsApi, type Account } from "@/lib/api/accounts"
import { toast } from "sonner"

const columns: ColumnDef<Account>[] = [
  {
    accessorKey: "account_name",
    header: "Account Name",
    size: 200,
  },
  {
    accessorKey: "account_type",
    header: "Account Type",
    size: 150,
  },
  {
    accessorKey: "opening_balance",
    header: "Opening Balance",
    size: 150,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    },
  },
  {
    accessorKey: "created_at",
    header: "Created At",
    size: 150,
    cell: ({ getValue }: CellContext<Account, unknown>) => {
      const value = getValue() as string;
      return new Date(value).toLocaleDateString()
    },
  },
]

const accountTypeOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Account', value: 'bank' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Savings Account', value: 'savings' },
  { label: 'Investment Account', value: 'investment' },
]

const filterOptions: FilterOption[] = [
  {
    type: 'select',
    label: 'Account Type',
    key: 'account_type',
    options: accountTypeOptions,
  },
  {
    type: 'input',
    label: 'Opening Balance',
    key: 'opening_balance',
    placeholder: 'Enter opening balance',
  },
]

const formFields: FormField[] = [
  {
    type: 'input',
    label: 'Account Name',
    key: 'account_name',
    placeholder: 'Enter account name',
    required: true,
  },
  {
    type: 'select',
    label: 'Account Type',
    key: 'account_type',
    options: accountTypeOptions,
    required: true,
  },
  {
    type: 'input',
    label: 'Opening Balance',
    key: 'opening_balance',
    placeholder: 'Enter opening balance',
    required: true,
  },
]

export function AccountsPage() {
  const [accounts, setAccounts] = React.useState<Account[]>([])
  const [loading, setLoading] = React.useState(true)

  // Fetch accounts on mount
  React.useEffect(() => {
    loadAccounts()
  }, [])

  const loadAccounts = async () => {
    try {
      setLoading(true)
      const data = await accountsApi.getAll()
      setAccounts(data)
    } catch (error) {
      toast.error("Failed to load accounts")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = async (data: Record<string, any>) => {
    try {
      await accountsApi.create({
        account_name: data.account_name,
        account_type: data.account_type,
        opening_balance: parseFloat(data.opening_balance),
      })
      toast.success("Account created successfully")
      loadAccounts()
    } catch (error) {
      toast.error("Failed to create account")
      console.error(error)
    }
  }

  const handleEdit = async (data: Record<string, any>) => {
    try {
      await accountsApi.update(data.id, {
        account_name: data.account_name,
        account_type: data.account_type,
        opening_balance: parseFloat(data.opening_balance),
      })
      toast.success("Account updated successfully")
      loadAccounts()
    } catch (error) {
      toast.error("Failed to update account")
      console.error(error)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await accountsApi.delete(id)
      toast.success("Account deleted successfully")
      loadAccounts()
    } catch (error) {
      toast.error("Failed to delete account")
      console.error(error)
    }
  }

  const handleFilter = (filters: Record<string, any>) => {
    // TODO: Implement filtering logic
    console.log('Applied filters:', filters)
  }

  return (
    <BasePage<Account>
      title="Accounts"
      data={accounts}
            columns={columns}
      filterOptions={filterOptions}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onFilter={handleFilter}
      loading={loading}
    />
  )
} 