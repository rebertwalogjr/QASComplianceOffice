"use client"

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import TableCellViewer from "./table-cell-viewer";
import StatusBadge from "@/components/status-badge";
import PopoverStatusFilter from "./popover-status-filter";
import Transaction from "@/lib/transaction";

export const columns: ColumnDef<Transaction>[] = [
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
      return <TableCellViewer item={row.original as Transaction} className={row.original.status === "Closed" ? "opacity-50" : ""} />
    },
  },
  {
    accessorKey: "auditNo",
    header: "Audit Finding No.",
    // cell: ({row}) => {
    //   return <div className={row.original.status === "Closed" ? "opacity-50" : ""}>{row.original.auditNo}</div>
    // },
  },
  {
    accessorKey: "computedStatus",
    accessorFn: row => {
      if (row.status === "Open") {
        if (row.secondaryStatus === "New") return "New"
        if (row.secondaryStatus === "On-Hold") return "On-Hold"
        return "Open"
      }
      return row.status
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
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "project",
    header: "Project / Department",
  },
  // { accessorKey: "responsiblePerson", header: "Responsible Person" },
  // { accessorKey: "engagement", header: "Audit Engagement" },
  // { accessorKey: "rating", header: "Audit Rating" },
  // { accessorKey: "category", header: "Findings Category" },
  // { accessorKey: "details", header: "Details of Findings" },
  // { accessorKey: "approvedDate", header: "Date Approved" },
]