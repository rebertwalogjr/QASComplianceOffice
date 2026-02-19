import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isToday, isYesterday, isThisWeek, format, parseISO } from "date-fns";
import { AuditTrailPayload } from "@/prisma-actions/audit-trail";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUserName(firstName: string, lastName: string) {
  if (!firstName || !lastName) return "";
    const firstLetter = firstName.trim().charAt(0);
    const username = (firstLetter + lastName)
      .replace(/\s+/g, "")
      .toLowerCase();
    return username;
}

export function formatLongDate( input: Date | string | undefined ) {
  if (!input) return ""
  const d = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return ""

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(d)
}

export function groupAuditTrails(data: AuditTrailPayload[]) {
  const groups: Record<string, AuditTrailPayload[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Earlier: [],
  };

  data.forEach((trail) => {
    const date = new Date(trail.createdOn);
    
    if (isToday(date)) {
      groups["Today"].push(trail);
    } else if (isYesterday(date)) {
      groups["Yesterday"].push(trail);
    } else if (isThisWeek(date)) {
      groups["This Week"].push(trail);
    } else {
      groups["Earlier"].push(trail);
    }
  });

  return groups;
}
