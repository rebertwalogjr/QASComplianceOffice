"use client"

import React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn } from "@/lib/utils"
import { formatLongDate } from "@/lib/date-utils"

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false
  }

  return !isNaN(date.getDate())
}

type DatePickerProps = {
  placeholder?: string,
  disabled?: boolean,
  defaultDate?: Date,
  className?: string,
  onChange?: (date: Date | undefined) => void,
}

export function DatePicker({ placeholder, defaultDate, disabled, className, onChange }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(() => isValidDate(defaultDate) ? defaultDate : undefined)
  const [month, setMonth] = React.useState<Date | undefined>(() => isValidDate(defaultDate) ? defaultDate : undefined)
  const [value, setValue] = React.useState<string>(() => formatLongDate(date))
  
  const today = new Date()
  const endMonth = new Date(today.getFullYear() + 1, today.getMonth(), 1)

  React.useEffect(() => {
    if (isValidDate(defaultDate)) {
      setDate(defaultDate)
      setMonth(defaultDate)
      setValue(formatLongDate(defaultDate))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultDate?.getTime()])


  const handleSelect = (next?: Date) => {
    setDate(next)
    setValue(formatLongDate(next))
    setOpen(false)
    onChange?.(next)
  }


  const handleInputChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const raw = e.target.value
    setValue(raw)

    // Try to parse when user types; accept common formats
    const parsed = new Date(raw)
    if (isValidDate(parsed)) {
      setDate(parsed)
      setMonth(parsed)
      onChange?.(parsed)
    }
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      if (!disabled) setOpen(true)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={value}
          placeholder={placeholder}
          className={cn("bg-background pr-10", className)}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          aria-disabled={disabled}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-controls="date-picker-popover"
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              disabled={disabled}
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
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
              onSelect={(date) => {
                setDate(date)
                setValue(formatLongDate(date))
                setOpen(false)
              }}
            />

          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}