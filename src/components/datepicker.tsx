"use client"

import { useEffect, useState } from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { cn, toUTCMidnight } from "@/lib/utils"
import { formatLongDate } from "@/lib/utils"

function isValidDate(date: Date | null | undefined): date is Date {
  return !!date && !isNaN(date.getDate())
}

type DatePickerProps = {
  name?: string
  placeholder?: string,
  disabled?: boolean,
  defaultDate?: Date,
  className?: string,
  readonly?: boolean,
  onChange?: (date: Date | undefined) => void,
}

type DateRangePickerProps = {
  startName?: string;
  endName?: string;
  defaultStart?: Date | null;
  defaultEnd?: Date | null;
  disabled?: boolean;
  readonly?: boolean;
  onChange?: (range: { start?: Date | null; end?: Date | null }) => void;
}

function DatePicker({ name, placeholder, defaultDate, disabled, className, readonly, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date | undefined>(() => isValidDate(defaultDate) ? toUTCMidnight(defaultDate) : undefined)
  const [month, setMonth] = useState<Date | undefined>(() => isValidDate(defaultDate) ? defaultDate : undefined)

  const today = new Date()
  const endMonth = new Date(today.getFullYear() + 1, today.getMonth(), 1)

  useEffect(() => {
    if (isValidDate(defaultDate)) {
      const utcDate = toUTCMidnight(defaultDate)
      setDate(utcDate)
      setMonth(utcDate)
    }
  }, [defaultDate?.getTime()])


  const handleSelect = (next?: Date) => {
    if (readonly) return
    const utcDate = toUTCMidnight(next)
    setDate(utcDate)
    setOpen(false)
    onChange?.(utcDate)
  }

  return (
    <div className="flex flex-col gap-3">
      <Popover open={readonly ? false : open} onOpenChange={readonly ? () => { } : setOpen}>

        <PopoverTrigger asChild>
          <Button
            id="date-picker"
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between text-left font-normal px-3 bg-background border-input hover:bg-background h-10 relative",
              !date && "text-muted-foreground",
              readonly ? "cursor-default opacity-100 hover:bg-background border-dashed shadow-none" : "hover:bg-accent",
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


function DateRangePicker({ startName, endName, defaultStart, defaultEnd, disabled, readonly, onChange }: DateRangePickerProps) {
  // Logic mirrored from DatePicker
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)

  const [start, setStart] = useState<Date | undefined>(() => isValidDate(defaultStart) ? toUTCMidnight(defaultStart) : undefined)
  const [end, setEnd] = useState<Date | undefined>(() => isValidDate(defaultEnd) ? toUTCMidnight(defaultEnd) : undefined)

  useEffect(() => {
    if (isValidDate(defaultStart)) setStart(toUTCMidnight(defaultStart))
    if (isValidDate(defaultEnd)) setEnd(toUTCMidnight(defaultEnd))
  }, [defaultStart?.getTime(), defaultEnd?.getTime()])

  const handleSelectStart = (date?: Date) => {
    if (readonly) return
    const utcDate = toUTCMidnight(date)
    setStart(utcDate)
    setOpenStart(false)

    const newEnd = (utcDate && end && utcDate > end) ? undefined : end
    if (newEnd !== end) setEnd(newEnd)
    onChange?.({ start: utcDate, end: newEnd })
  }

  const handleSelectEnd = (date?: Date) => {
    if (readonly) return
    const utcDate = toUTCMidnight(date)
    setEnd(utcDate)
    setOpenEnd(false)
    onChange?.({ start, end: utcDate })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center w-full">
        {/* Start Date Popover */}
        <Popover open={readonly ? false : openStart} onOpenChange={readonly ? () => { } : setOpenStart}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 justify-between rounded-r-none border-r-0 font-normal px-3 h-10 truncate",
                !start && "text-muted-foreground",
                readonly ? "cursor-default opacity-100 border-dashed shadow-none" : "hover:bg-accent"
              )}
            >
              {start ? formatLongDate(start) : "From"}
              <CalendarIcon className="size-3.5 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={start}
              onSelect={handleSelectStart}
            />
          </PopoverContent>
        </Popover>

        <div className="h-10 border-y border-input bg-muted px-2 flex items-center text-muted-foreground text-[10px] font-bold border-x-0">
          TO
        </div>

        {/* End Date Popover */}
        <Popover open={readonly ? false : openEnd} onOpenChange={readonly ? () => { } : setOpenEnd}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              disabled={disabled}
              className={cn(
                "flex-1 justify-between rounded-l-none border-l-0 font-normal px-3 h-10 truncate",
                !end && "text-muted-foreground",
                readonly ? "cursor-default opacity-100 border-dashed shadow-none" : "hover:bg-accent"
              )}
            >
              {end ? formatLongDate(end) : "Until"}
              <CalendarIcon className="size-3.5 opacity-50 ml-2" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={end}
              onSelect={handleSelectEnd}
              disabled={(date) => {
                if (!start) return false
                const day = toUTCMidnight(date)
                return day ? day < start : false
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Inputs for form submission */}
      {startName && <input type="hidden" name={startName} value={start ? start.toISOString() : ""} />}
      {endName && <input type="hidden" name={endName} value={end ? end.toISOString() : ""} />}
    </div>
  )
}

export { DatePicker, DateRangePicker }