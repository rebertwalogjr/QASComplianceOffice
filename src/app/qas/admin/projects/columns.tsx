"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01, AlertTriangle } from "lucide-react"
import TableCellViewer from "./table-cell-viewer"
import { Project } from "../../../../../generated/prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as Project} />
    }
  },
  {
    accessorKey: "code",
    header: "Code"
  },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.companyId ? (row.original as any).company : null
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
    accessorKey: "isActive",
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
          {sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 />}
        </Button>
      </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={row.original.isActive === true ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600"} >{row.original.isActive === true ? "Active" : "Inactive"}</Badge>
    }
  },
]