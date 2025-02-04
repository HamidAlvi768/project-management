import * as React from 'react';
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, MoreVertical, Edit, Trash2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "./table-primitives"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'

export interface TableProps<TData> {
  columns: ColumnDef<TData>[]
  data: TData[]
  actions?: Array<'view' | 'edit' | 'delete'>
  onAction?: (type: string, row: TData) => void
  loading?: boolean
}

export function DataTable<TData>({
  columns: userColumns,
  data,
  actions,
  onAction,
  loading = false,
}: TableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columns = React.useMemo(() => {
    const numberingColumn = {
      id: 'numbering',
      header: '#',
      size: 60,
      cell: ({ row }: { row: { index: number } }) => row.index + 1,
    }

    const allColumns = [numberingColumn, ...userColumns]

    if (!actions?.length) return allColumns

    return [
      ...allColumns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }: { row: { original: TData } }) => (
          <div className="flex items-center justify-center gap-1">
            {actions.includes('edit') && (
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-[#f3f3f3] bg-transparent focus:ring-0 focus-visible:ring-0 focus:outline-none hover:border-0 border-0"
                onClick={() => onAction?.('edit', row.original)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {actions.includes('delete') && (
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-[#f3f3f3] bg-transparent focus:ring-0 focus-visible:ring-0 focus:outline-none hover:border-0 border-0"
                onClick={() => onAction?.('delete', row.original)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ),
      },
    ]
  }, [actions, onAction, userColumns])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading...
      </div>
    )
  }

  if (!data.length) {
    return (
      <div className="p-8 text-center text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50">
              {headerGroup.headers.map((header, index) => (
                <TableHead
                  key={header.id}
                  className={`
                    ${header.column.getCanSort() ? 'cursor-pointer select-none' : ''}
                    text-gray-600 font-medium text-sm whitespace-nowrap px-4
                    ${index !== headerGroup.headers.length - 1 ? 'relative after:content-[""] after:absolute after:right-0 after:top-1/4 after:h-1/2 after:w-px after:bg-[#f0f0f0]' : ''}
                  `}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center justify-center gap-1">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getCanSort() && (
                      {asc: <ChevronUp className="h-4 w-4 flex-shrink-0" />,
                       desc: <ChevronDown className="h-4 w-4 flex-shrink-0" />}
                      [header.column.getIsSorted() as string] ?? null
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="hover:bg-gray-50 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className="py-4 px-4 text-sm whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from './table-primitives';
