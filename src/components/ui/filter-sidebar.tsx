"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export interface FilterOption {
  type: 'input' | 'select' | 'date'
  label: string
  key: string
  placeholder?: string
  options?: Array<{ label: string; value: string }>
}

export interface FilterSidebarProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  fields: FilterOption[]
  onFilter: (filters: Record<string, any>) => void
}

export function FilterSidebar({
  isOpen,
  onOpenChange,
  fields,
  onFilter,
}: FilterSidebarProps) {
  const [filters, setFilters] = React.useState<Record<string, any>>({})

  const handleFilter = () => {
    onFilter(filters)
    onOpenChange(false)
  }

  const handleClear = () => {
    setFilters({})
  }

  return (
    <>
      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full sm:w-[400px] bg-white shadow-[0_16px_32px_#4198ff33] z-[50] transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 sm:p-6 border-b bg-white z-[51]">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Filter</h2>
          <Button
            variant="close"
            size="icon"
            className="h-6 w-6 p-0 border border-[#292d32]"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4 text-[#292d32]" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Content */}
        <div className="relative h-[calc(100%-80px)] overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-6">
            {fields.map((field) => (
              <div key={field.key} className="space-y-2">
                <Label>{field.label}</Label>
                {field.type === 'input' && (
                  <Input
                    placeholder={field.placeholder}
                    value={filters[field.key] || ''}
                    onChange={(e) => setFilters(prev => ({ ...prev, [field.key]: e.target.value }))}
                  />
                )}
                {field.type === 'select' && field.options && (
                  <Select
                    value={filters[field.key] || ''}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, [field.key]: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {field.type === 'date' && (
                  <DatePicker
                    date={filters[field.key] ? new Date(filters[field.key]) : undefined}
                    setDate={(date: Date | undefined) => setFilters(prev => ({ ...prev, [field.key]: date?.toISOString() }))}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t bg-white">
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="responsive"
              onClick={handleClear}
            >
              Clear
            </Button>
            <Button
              variant="add"
              size="responsive"
              onClick={handleFilter}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 