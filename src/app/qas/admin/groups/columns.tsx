"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01, AlertTriangle  } from "lucide-react"
import Group from "@/lib/group"
import TableCellViewer from "./table-cell-viewer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns: ColumnDef<Group>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as Group} />
    }
  },
  {
    accessorKey: "code",
    header: "Code",
  },
  {
    accessorKey: "projectDepartmentList.name",
    header: "Project/Department",
    cell: ({ row }) => {
      const project = row.original.projectDepartmentId ? (row.original as any).projectDepartmentList : null
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
  {
    accessorKey: "inChargeId",
    header: "Group In-Charge",
  },
  {
    accessorKey: "emailAddress",
    header: "Email Address",
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
            { sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 /> }
          </Button>
        </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={ row.original.isActive === true ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600" } >{ row.original.isActive === true ? "Active" : "Inactive" }</Badge>
    }
  },
]