import * as React from "react"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { BasePage } from "@/components/ui/base-page"
import type { FilterOption } from "@/components/ui/filter-sidebar"
import type { FormField } from "@/components/forms/data-form"

interface Budget {
  id: string
  category: string
  amount: number
  month: string
  description: string
}

const columns: ColumnDef<Budget>[] = [
  {
    accessorKey: "category",
    header: "Category",
    size: 150,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 120,
    cell: ({ getValue }: CellContext<Budget, unknown>) => {
      const value = getValue() as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    },
  },
  {
    accessorKey: "month",
    header: "Month",
    size: 120,
  },
  {
    accessorKey: "description",
    header: "Description",
    size: 200,
  },
]

const monthOptions = [
  { label: 'January', value: 'january' },
  { label: 'February', value: 'february' },
  { label: 'March', value: 'march' },
  { label: 'April', value: 'april' },
  { label: 'May', value: 'may' },
  { label: 'June', value: 'june' },
  { label: 'July', value: 'july' },
  { label: 'August', value: 'august' },
  { label: 'September', value: 'september' },
  { label: 'October', value: 'october' },
  { label: 'November', value: 'november' },
  { label: 'December', value: 'december' },
]

const categoryOptions = [
  { label: 'Food & Dining', value: 'food' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Shopping', value: 'shopping' },
  { label: 'Bills & Utilities', value: 'bills' },
  { label: 'Entertainment', value: 'entertainment' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Education', value: 'education' },
  { label: 'Personal Care', value: 'personal_care' },
  { label: 'Travel', value: 'travel' },
  { label: 'Others', value: 'others' },
]

const filterOptions: FilterOption[] = [
  {
    type: 'select',
    label: 'Expense Category',
    key: 'category',
    options: categoryOptions,
  },
  {
    type: 'input',
    label: 'Amount',
    key: 'amount',
    placeholder: 'Enter amount',
  },
  {
    type: 'select',
    label: 'Month',
    key: 'month',
    options: monthOptions,
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
    label: 'Month',
    key: 'month',
    options: monthOptions,
    required: true,
  },
  {
    type: 'select',
    label: 'Expense Category',
    key: 'category',
    options: categoryOptions,
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

const sampleData: Budget[] = [
  {
    id: "1",
    category: "Food & Dining",
    amount: 500.00,
    month: "January",
    description: "Monthly food budget",
  },
  {
    id: "2",
    category: "Transportation",
    amount: 200.00,
    month: "January",
    description: "Public transport and fuel",
  },
]

export function BudgetsPage() {
  const handleAdd = (data: Record<string, any>) => {
    console.log('New budget data:', data)
  }

  const handleEdit = (data: Record<string, any>) => {
    console.log('Updated budget data:', data)
  }

  const handleDelete = (id: string) => {
    console.log('Deleting budget:', id)
  }

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Applied filters:', filters)
  }

  return (
    <BasePage<Budget>
      title="Budgets"
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