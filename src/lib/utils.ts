import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isToday, isYesterday, isThisWeek, format } from "date-fns"
import { AuditTrailPayload } from "@/server-actions/audit-trail"
import { UpdateTrailPayload } from "@/server-actions/update-trail"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateUserName(firstName: string, middleName: string, lastName: string) {
  if (!firstName || !lastName) return ""
  const firstLetter = firstName.trim().charAt(0)
  const secondLetter = middleName.trim().charAt(0)
  const username = (firstLetter + secondLetter + lastName)
    .replace(/\s+/g, "")
    .toLowerCase();
  return username;
}

export function formatLongDate(input: Date | string | undefined) {
  if (!input) return ""
  const d = typeof input === "string" ? new Date(input) : input
  if (Number.isNaN(d.getTime())) return ""

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC"
  }).format(d)
}

export function toUTCMidnight(date: Date | undefined | null): Date | undefined {
  if (!date || isNaN(date.getTime())) return undefined
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
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

export function groupTrails(data: UpdateTrailPayload[]) {
  const groups: Record<string, UpdateTrailPayload[]> = {};

  data.forEach((trail) => {
    const date = new Date(trail.createOn);
    let label = "";

    if (isToday(date)) {
      label = "Today";
    } else if (isYesterday(date)) {
      label = "Yesterday";
    } else {
      label = format(date, "MMMM d, yyyy");
    }

    if (!groups[label]) {
      groups[label] = [];
    }
    groups[label].push(trail);
  });

  return groups;
}

export const IconSwitcher = (extension: string): string => {
  const ext = extension.toLowerCase().startsWith('.')
    ? extension.toLowerCase()
    : `.${extension.toLowerCase()}`;
  const iconMap: Record<string, string> = {
    // Images
    ".png": "bi-filetype-png text-orange-500",
    ".jpg": "bi-filetype-jpg text-orange-500",
    ".jpeg": "bi-filetype-jpg text-orange-500",
    ".gif": "bi-filetype-gif text-orange-500",
    ".svg": "bi-filetype-svg text-orange-500",
    // Documents
    ".pdf": "bi-filetype-pdf text-red-600",
    ".doc": "bi-filetype-doc text-blue-700",
    ".docx": "bi-filetype-docx text-blue-700",
    ".txt": "bi-filetype-txt text-gray-500",
    // Spreadsheets (Excel)
    ".xls": "bi-filetype-xls text-green-700",
    ".xlsx": "bi-filetype-xlsx text-green-700",
    ".xlsm": "bi-filetype-xlsx text-green-700",
    ".csv": "bi-filetype-csv text-green-800",
    // Presentations
    ".ppt": "bi-filetype-ppt text-orange-700",
    ".pptx": "bi-filetype-pptx text-orange-700",
    // Archives
    ".zip": "bi-file-zip text-yellow-600",
    ".rar": "bi-file-zip text-yellow-600",
    ".7z": "bi-file-zip text-yellow-600",
  };
  return iconMap[ext] || "bi-file-earmark text-gray-700";
};

export function toTitleCase(str: string | null | undefined): string {
  if (!str) return ""

  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function generateRandomPassword(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let password = ""

  // Use crypto.randomBytes to pick characters securely
  const randomBytes = crypto.randomBytes(length)
  for (let i = 0; i < length; i++) {
    password += chars[randomBytes[i] % chars.length]
  }

  return password
}