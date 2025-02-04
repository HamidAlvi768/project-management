"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface FormField {
  type: 'input' | 'select' | 'textarea' | 'date' | 'number'
  label: string
  key: string
  placeholder?: string
  options?: { label: string; value: string }[] // For select type
  required?: boolean
}

interface DataFormProps {
  fields: FormField[]
  onSubmit: (data: Record<string, any>) => void
  initialData?: Record<string, any> | null
  submitLabel?: string
}

export function DataForm({ fields, onSubmit, initialData, submitLabel = "Submit" }: DataFormProps) {
  const [formData, setFormData] = React.useState<Record<string, any>>(initialData || {})

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div 
            key={field.key} 
            className={cn(
              "space-y-2 text-left",
              field.type === 'textarea' && "sm:col-span-2"
            )}
          >
            <Label>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            
            {field.type === 'input' && (
              <Input
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="w-full bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            )}

            {field.type === 'number' && (
              <Input
                type="number"
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, parseFloat(e.target.value))}
                required={field.required}
                className="w-full bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            )}

            {field.type === 'select' && (
              <Select
                value={formData[field.key] || ''}
                onValueChange={(value) => handleChange(field.key, value)}
                required={field.required}
              >
                <SelectTrigger className="w-full bg-white border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                  <SelectValue placeholder={field.placeholder || `Select ${field.label}`} />
                </SelectTrigger>
                <SelectContent 
                  position="popper"
                  className="w-[--radix-select-trigger-width] bg-white border border-gray-200 rounded-lg shadow-lg"
                  align="start"
                  sideOffset={4}
                >
                  {field.options?.map((opt) => (
                    <SelectItem 
                      key={opt.value} 
                      value={opt.value}
                      className="hover:bg-gray-50 focus:bg-gray-50 cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {field.type === 'date' && (
              <DatePicker
                date={formData[field.key]}
                setDate={(date) => handleChange(field.key, date)}
              />
            )}

            {field.type === 'textarea' && (
              <Textarea
                placeholder={field.placeholder}
                value={formData[field.key] || ''}
                onChange={(e) => handleChange(field.key, e.target.value)}
                required={field.required}
                className="w-full min-h-[100px] bg-white border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            )}
          </div>
        ))}
      </div>
      <Button type="submit" variant="default" className="w-full">
        {submitLabel}
      </Button>
    </form>
  )
} 