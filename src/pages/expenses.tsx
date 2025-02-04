import * as React from "react"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { BasePage } from "@/components/ui/base-page"
import type { FilterOption } from "@/components/ui/filter-sidebar"
import type { FormField } from "@/components/forms/data-form"

interface Expense {
  id: string
  account: string
  category: string
  amount: number
  description: string
  date: string
}

const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: "account",
    header: "Account",
    size: 150,
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 150,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 120,
    cell: ({ getValue }: CellContext<Expense, unknown>) => {
      const value = getValue() as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 120,
  },
]

const filterOptions: FilterOption[] = [
  {
    type: 'select',
    label: 'Account',
    key: 'account',
    options: [
      { label: 'Cash', value: 'cash' },
      { label: 'Bank Account', value: 'bank' },
      { label: 'Credit Card', value: 'credit_card' },
    ],
  },
  {
    type: 'select',
    label: 'Expense Category',
    key: 'category',
    options: [
      { label: 'Food & Dining', value: 'food' },
      { label: 'Transportation', value: 'transportation' },
      { label: 'Shopping', value: 'shopping' },
      { label: 'Bills & Utilities', value: 'bills' },
      { label: 'Entertainment', value: 'entertainment' },
      { label: 'Others', value: 'others' },
    ],
  },
  {
    type: 'input',
    label: 'Amount',
    key: 'amount',
    placeholder: 'Enter amount',
  },
  {
    type: 'date',
    label: 'Start Date',
    key: 'startDate',
  },
  {
    type: 'date',
    label: 'End Date',
    key: 'endDate',
  },
]

const formFields: FormField[] = [
  {
    type: 'select',
    label: 'Account',
    key: 'account',
    options: [
      { label: 'Cash', value: 'cash' },
      { label: 'Bank Account', value: 'bank' },
      { label: 'Credit Card', value: 'credit_card' },
    ],
    required: true,
  },
  {
    type: 'date',
    label: 'Expense Date',
    key: 'date',
    required: true,
  },
  {
    type: 'select',
    label: 'Expense Category',
    key: 'category',
    options: [
      { label: 'Food & Dining', value: 'food' },
      { label: 'Transportation', value: 'transportation' },
      { label: 'Shopping', value: 'shopping' },
      { label: 'Bills & Utilities', value: 'bills' },
      { label: 'Entertainment', value: 'entertainment' },
      { label: 'Others', value: 'others' },
    ],
    required: true,
  },
  {
    type: 'input',
    label: 'Amount',
    key: 'amount',
    placeholder: 'Enter amount',
    required: true,
  },
  {
    type: 'input',
    label: 'Description',
    key: 'description',
    placeholder: 'Enter description',
  },
]

const sampleData: Expense[] = [
  {
    id: "1",
    account: "Cash",
    category: "Food & Dining",
    amount: 25.50,
    description: "Lunch at restaurant",
    date: "2024-01-22",
  },
  {
    id: "2",
    account: "Credit Card",
    category: "Shopping",
    amount: 150.75,
    description: "Groceries",
    date: "2024-01-23",
  },
]

export function ExpensesPage() {
  const handleAdd = (data: Record<string, any>) => {
    console.log('New expense data:', data)
  }

  const handleEdit = (data: Record<string, any>) => {
    console.log('Updated expense data:', data)
  }

  const handleDelete = (id: string) => {
    console.log('Deleting expense:', id)
  }

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Applied filters:', filters)
  }

  return (
    <BasePage<Expense>
      title="Expenses"
      data={sampleData}
      columns={columns}
      filterOptions={filterOptions}
      formFields={formFields}
      onAdd={handleAdd}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onFilter={handleFilter}
    />
  )
} 