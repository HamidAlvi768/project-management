"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPicker } from "react-day-picker"

interface DatePickerProps {
  date?: Date
  setDate: (date: Date | undefined) => void
  className?: string
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-white border-gray-200",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white" align="start">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          showOutsideDays={true}
          className="p-3"
          classNames={{
            months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
            month: "space-y-4",
            caption: "flex justify-center pt-1 relative items-center",
            caption_label: "text-sm font-medium",
            nav: "space-x-1 flex items-center",
            nav_button: cn(
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-transparent hover:border-transparent focus:outline-none focus:ring-0 focus:ring-offset-0"
            ),
            nav_button_previous: "absolute left-1",
            nav_button_next: "absolute right-1",
            table: "w-full border-collapse space-y-1",
            head_row: "flex",
            head_cell: "text-gray-500 rounded-md w-9 font-normal text-[0.8rem]",
            row: "flex w-full mt-2",
            cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day: cn(
              "h-9 w-9 p-0 font-normal bg-white text-gray-900",
              "hover:bg-gray-100 rounded-md transition-colors"
            ),
            day_selected: "bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-600 focus:bg-purple-50 focus:text-purple-600 rounded-md font-medium",
            day_today: "bg-gray-50 text-gray-900 rounded-md",
            day_outside: "text-gray-400 opacity-50 hover:bg-transparent",
            day_disabled: "text-gray-400 opacity-50 hover:bg-transparent",
            day_hidden: "invisible",
          }}
        />
      </PopoverContent>
    </Popover>
  )
} 