"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowDownAZ, ArrowDownZA, ArrowDown01, AlertTriangle  } from "lucide-react"
// import AuditNumber from "@/lib/audit-report"
import { AuditReport } from "../../../../../generated/prisma/client"
import TableCellViewer from "./table-cell-viewer"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export const columns: ColumnDef<AuditReport>[] = [
  {
    accessorKey: "name",
    header: "Audit Number",
    cell: ({ row }) => {
      return <TableCellViewer item={row.original as AuditReport} />
    }
  },
  {
    accessorKey: "companyId.name",
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
            {company?.name || "--"}
          </span>
        </div>
      )
    }
  },
  {
    accessorKey: "projectId.name",
    header: "Project",
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
            {project?.name || "--"}
          </span>
        </div>
      )
    }
  },
  {    
    accessorKey: "auditEngagementId.name",
    header: "Audit Engagement",
    cell: ({ row }) => {
      const engagement = row.original.auditEngagementId ? (row.original as any).auditReport : null
      const isActive = engagement ? engagement.isActive : null
      return (
        <div className="flex items-center gap-2">
          {isActive === false && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Warning: This audit engagement is currently inactive.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <span className={isActive === false ? "text-muted-foreground" : ""}>
            {engagement?.name || "--"}
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
            { sorted === "asc" ? <ArrowDownAZ /> : sorted === "desc" ? <ArrowDownZA /> : <ArrowDown01 /> }
          </Button>
        </div>
    },
    cell: ({ row }) => {
      return <Badge variant="outline" className={ row.original.isActive === true ? "bg-green-50 text-green-500 border-green-500" : "bg-gray-50 text-gray-600 border-gray-600" } >{ row.original.isActive ? "Active" : "Inactive" }</Badge>
    }
  },
]