import * as React from "react"
import { ColumnDef, CellContext } from "@tanstack/react-table"
import { BasePage } from "@/components/ui/base-page"
import type { FilterOption } from "@/components/ui/filter-sidebar"
import type { FormField } from "@/components/forms/data-form"

interface Transfer {
  id: string
  fromAccount: string
  toAccount: string
  amount: number
  notes: string
  date: string
}

const columns: ColumnDef<Transfer>[] = [
  {
    accessorKey: "fromAccount",
    header: "From",
    size: 150,
  },
  {
    accessorKey: "toAccount",
    header: "To",
    size: 150,
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 120,
    cell: ({ getValue }: CellContext<Transfer, unknown>) => {
      const value = getValue() as number;
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(value)
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    size: 200,
  },
  {
    accessorKey: "date",
    header: "Date",
    size: 120,
  },
]

const accountOptions = [
  { label: 'Cash', value: 'cash' },
  { label: 'Bank Account', value: 'bank' },
  { label: 'Credit Card', value: 'credit_card' },
  { label: 'Savings Account', value: 'savings' },
  { label: 'Investment Account', value: 'investment' },
]

const filterOptions: FilterOption[] = [
  {
    type: 'select',
    label: 'From Account',
    key: 'fromAccount',
    options: accountOptions,
  },
  {
    type: 'select',
    label: 'To Account',
    key: 'toAccount',
    options: accountOptions,
  },
  {
    type: 'input',
    label: 'Amount From',
    key: 'amountFrom',
    placeholder: 'Enter minimum amount',
  },
  {
    type: 'input',
    label: 'Amount To',
    key: 'amountTo',
    placeholder: 'Enter maximum amount',
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
    label: 'From Account',
    key: 'fromAccount',
    options: accountOptions,
    required: true,
  },
  {
    type: 'select',
    label: 'To Account',
    key: 'toAccount',
    options: accountOptions,
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
    type: 'date',
    label: 'Transfer Date',
    key: 'date',
    required: true,
  },
  {
    type: 'input',
    label: 'Description',
    key: 'notes',
    placeholder: 'Enter description',
  },
]

const sampleData: Transfer[] = [
  {
    id: "1",
    fromAccount: "Bank Account",
    toAccount: "Savings Account",
    amount: 1000.00,
    notes: "Monthly savings transfer",
    date: "2024-01-22",
  },
  {
    id: "2",
    fromAccount: "Cash",
    toAccount: "Bank Account",
    amount: 500.50,
    notes: "Cash deposit",
    date: "2024-01-23",
  },
]

export function TransfersPage() {
  const handleAdd = (data: Record<string, any>) => {
    console.log('New transfer data:', data)
  }

  const handleEdit = (data: Record<string, any>) => {
    console.log('Updated transfer data:', data)
  }

  const handleDelete = (id: string) => {
    console.log('Deleting transfer:', id)
  }

  const handleFilter = (filters: Record<string, any>) => {
    console.log('Applied filters:', filters)
  }

  return (
    <BasePage<Transfer>
      title="Transfers"
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