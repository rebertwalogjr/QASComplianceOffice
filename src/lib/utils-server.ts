"use server"

import { format, isWeekend, addDays } from "date-fns"
import { prisma } from "./prisma"

export async function addDate(startDate: Date, daysToAdd: number) : Promise<Date> {
  const holidays = await prisma.holiday.findMany({
    where: { isActive: true },
    select: { date: true }
  })

  const holidayStrings = new Set(
    holidays.map(h => format(h.date , "yyyy-MM-dd"))
  )

  let resultDate = new Date(startDate)
  let addedDays = 0

  while (addedDays < daysToAdd) {
    resultDate = addDays(resultDate, 1);

    const isHoliday = holidayStrings.has(format(resultDate, "yyyy-MM-dd"))

    if (!isWeekend(resultDate) && !isHoliday) {
      addedDays++
    }
  }

  return resultDate
}