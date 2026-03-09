"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { AlertTriangle, ArrowUpDown } from "lucide-react";
import TableCellViewer from "./table-cell-viewer";
import StatusBadge from "@/components/status-badge";
import PopoverStatusFilter from "./popover-status-filter";
import { JobTransaction } from "../../../../generated/prisma/client";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { TransactionBasicPaylod } from "@/server-actions/transaction";

export const columns: ColumnDef<TransactionBasicPaylod>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div className="flex items-center justify-between">
          Series No.
          <Button
            variant="ghost"
            className="hover:bg-background"
            size="icon-sm"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <ArrowUpDown />
          </Button>
        </div>
      )
    },
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as TransactionBasicPaylod} className={row.original.jobStatus === "Closed" ? "opacity-50" : ""} />
    },
  },
  {
    accessorKey: "auditReport.name",
    header: "Audit Finding No.",
    // cell: ({row}) => {
    //   return <div className={row.original.status === "Closed" ? "opacity-50" : ""}>{row.original.auditNo}</div>
    // },
  },
  {
    accessorKey: "computedStatus",
    accessorFn: row => {
      if (row.jobStatus?.toLowerCase() === "open") {
        // if (row.secondaryStatus === "New") return "New"
        // if (row.secondaryStatus === "On-Hold") return "On-Hold"
        return "open"
      }
      return row.jobStatus
    },
    header: ({ column }) => (
      <div className="flex items-center justify-between">
        Status
        <PopoverStatusFilter column={column} />
      </div>
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>("computedStatus")
      return StatusBadge({ status: value })
    },
    filterFn: (row, columnnId, filterValues) => {
      const value = row.getValue(columnnId)
      if (!filterValues || filterValues.length === 0) return true
      return filterValues.includes(value)
    },
  },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => {
  //     return (
  //       <div className="flex items-center justify-between">
  //         Status
  //         <PopoverStatusFilter column={column} />
  //       </div>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     let main = row.original.status
  //     let secondary = row.original.secondaryStatus
  //     if (main === "Open") {
  //       if (secondary === "New") {
  //         return StatusBadge({ status: secondary })
  //       }
  //       if (secondary === "On-Hold") {
  //         return StatusBadge({ status: secondary })
  //       }
  //       return StatusBadge({ status: main })
  //     }
  //     return StatusBadge({ status: main })
  //   }
  // },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company ? (row.original as any).company : null
      const companyIsActive = company ? company.isActive : null
      return (
        <div className="flex items-center gap-2">
          {companyIsActive === false && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Warning: This company is currently inactive.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className={companyIsActive === false ? "text-muted-foreground" : ""}>
            {company?.name || "No Company"}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "projectId.name",
    header: "Project/Department",
    cell: ({ row }) => {
      const project = row.original.project ? (row.original as any).project : null
      const isActive = project ? project.isActive : null
      return (
        <div className="flex items-center gap-2">
          {isActive === false && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Warning: This project is currently inactive.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className={isActive === false ? "text-muted-foreground" : ""}>
            {project?.name || "No Company"}
          </span>
        </div>
      )
    }
  },
  // { accessorKey: "responsiblePerson", header: "Responsible Person" },
  // { accessorKey: "engagement", header: "Audit Engagement" },
  // { accessorKey: "rating", header: "Audit Rating" },
  // { accessorKey: "category", header: "Findings Category" },
  // { accessorKey: "details", header: "Details of Findings" },
  // { accessorKey: "approvedDate", header: "Date Approved" },
]