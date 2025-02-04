import * as React from "react"
import { Plus, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/ui/table"
import { FilterSidebar, type FilterOption } from "@/components/ui/filter-sidebar"
import { CustomDialog, DeleteConfirmationDialog } from "@/components/ui/dialog"
import { DataForm, type FormField } from "@/components/forms/data-form"
import type { ColumnDef } from "@tanstack/react-table"

export interface BasePageProps<T extends { id: string }> {
  title: string
  data: T[]
  columns: ColumnDef<T>[]
  filterOptions: FilterOption[]
  formFields: FormField[]
  onAdd: (data: Record<string, any>) => void
  onEdit: (data: Record<string, any>) => void
  onDelete: (id: string) => void
  onFilter: (filters: Record<string, any>) => void
  loading?: boolean
}

export function BasePage<T extends { id: string }>({
  title,
  data,
  columns,
  filterOptions,
  formFields,
  onAdd,
  onEdit,
  onDelete,
  onFilter,
  loading = false,
}: BasePageProps<T>) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [isAddOpen, setIsAddOpen] = React.useState(false)
  const [isEditOpen, setIsEditOpen] = React.useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<T | null>(null)

  const handleAction = (type: string, item: T) => {
    switch (type) {
      case 'edit':
        setSelectedItem(item)
        setIsEditOpen(true)
        break
      case 'delete':
        setSelectedItem(item)
        setIsDeleteOpen(true)
        break
    }
  }

  const handleAdd = (data: Record<string, any>) => {
    onAdd(data)
    setIsAddOpen(false)
  }

  const handleEdit = (data: Record<string, any>) => {
    onEdit({ ...data, id: selectedItem?.id })
    setIsEditOpen(false)
    setSelectedItem(null)
  }

  const handleDelete = () => {
    if (selectedItem) {
      onDelete(selectedItem.id)
      setIsDeleteOpen(false)
      setSelectedItem(null)
    }
  }

  const handleFilter = (filters: Record<string, any>) => {
    onFilter(filters)
    setIsFilterOpen(false)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/30">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-0 p-6">
        <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          <Button 
            variant="add"
            size="responsive"
            onClick={() => setIsAddOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {title.slice(0, -1)}
          </Button>
          <Button 
            variant="outline" 
            size="responsive"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4 mr-2 text-gray-500" />
            Filter
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 mx-6">
        <DataTable
          columns={columns}
          data={data}
          actions={['edit', 'delete']}
          onAction={handleAction}
          loading={loading}
        />
      </div>

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={isFilterOpen}
        onOpenChange={setIsFilterOpen}
        fields={filterOptions}
        onFilter={handleFilter}
      />

      {/* Add Dialog */}
      <CustomDialog
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title={`Add ${title.slice(0, -1)}`}
        submitLabel="Add"
        onSubmit={() => {}}
      >
        <DataForm
          fields={formFields}
          onSubmit={handleAdd}
          submitLabel="Add"
        />
      </CustomDialog>

      {/* Edit Dialog */}
      <CustomDialog
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false)
          setSelectedItem(null)
        }}
        title={`Edit ${title.slice(0, -1)}`}
        submitLabel="Save Changes"
        onSubmit={() => {}}
        hideSubmitButton={true}
      >
        <DataForm
          fields={formFields}
          initialData={selectedItem}
          onSubmit={handleEdit}
          submitLabel="Save Changes"
        />
      </CustomDialog>

      {/* Delete Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false)
          setSelectedItem(null)
        }}
        onDelete={handleDelete}
      />
    </div>
  )
} 