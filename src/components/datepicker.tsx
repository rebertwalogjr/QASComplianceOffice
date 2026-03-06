"use client"

import { useEffect, useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { formatLongDate } from "@/lib/date-utils"

function isValidDate(date: Date | undefined): date is Date {
  return !!date && !isNaN(date.getDate())
}

type DatePickerProps = {
  name?: string
  placeholder?: string,
  disabled?: boolean,
  defaultDate?: Date,
  className?: string,
  onChange?: (date: Date | undefined) => void,
}

export function DatePicker({ name, placeholder, defaultDate, disabled, className, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(() => isValidDate(defaultDate) ? defaultDate : undefined)
  const [month, setMonth] = useState<Date | undefined>(() => isValidDate(defaultDate) ? defaultDate : undefined)

  const today = new Date()
  const endMonth = new Date(today.getFullYear() + 1, today.getMonth(), 1)

  useEffect(() => {
    if (isValidDate(defaultDate)) {
      setDate(defaultDate)
      setMonth(defaultDate)
    }
  }, [defaultDate?.getTime()])


  const handleSelect = (next?: Date) => {
    setDate(next)
    setOpen(false)
    onChange?.(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>

        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal px-3 bg-background border-input hover:bg-background h-10 relative",
              !date && "text-muted-foreground",
              className
            )}
          >
            <span className="truncate">
              {date ? formatLongDate(date) : (placeholder ?? "Pick a date")}
            </span>
            <CalendarIcon className="size-3.5" />
          </Button>
        </PopoverTrigger>

        {name && (
          <input type="hidden" name={name} value={date ? date.toISOString() : ""} />
        )}

        <PopoverContent
          className="w-auto overflow-hidden p-0"
          align="end"
          alignOffset={-8}
          sideOffset={10}
        >
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            month={month}
            onMonthChange={setMonth}
            endMonth={endMonth}
            onSelect={handleSelect}
          />

        </PopoverContent>
      </Popover>
    </div>
  )
}