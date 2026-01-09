"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01  } from "lucide-react"
import AuditNumber from "@/lib/audit-number"
import TableCellViewer from "./table-cell-viewer"

export const columns: ColumnDef<AuditNumber>[] = [
  {
    accessorKey: "auditNumber",
    header: "Audit Number",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as AuditNumber} />
    }
  },
  {
    accessorKey: "company",
    header: "Company"
  },
  {
    accessorKey: "project",
    header: "Project"
  },
  {    
    accessorKey: "auditEngagement",
    header: "Audit Engagement"
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      const sorted = column.getIsSorted()
      return <div className="flex items-center justify-between">
          Status
          <Button
            variant="ghost"
            className="hover:bg-background"
            size="icon-sm"
            onClick={() => {
              sorted === "asc" 
              ? column.toggleSorting(true)
              : sorted === "desc" 
              ? column.clearSorting()
              : column.toggleSorting(false)
            }}
            aria-label={sorted === "asc" ? "Sorted status descending" : "Sort status ascending"}
          >
            { sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 /> }
          </Button>
        </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={ row.original.status === "Active" ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600" } >{ row.original.status }</Badge>
    }
  },
]