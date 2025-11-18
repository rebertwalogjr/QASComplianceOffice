import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, CircleCheck, CircleX, Hand, Loader, ThumbsUp } from "lucide-react";
import { z } from "zod";
import TableCellViewer from "./table-cell-viewer";

export type Transaction = {
  id: string,
  auditNo: string,
  company: string,
  project: string,
  resposiblePerson: string,
  status: "new" | "outstanding" | "cancelled" | "closed" | "for approval" | "closing approval",
  engagement: string,
  rating: string,
  category: string,
  details: string,
  approvedDate: string
}

function getStatusLabel(status: string) {
  switch (status) {
    case "closed":
      return <>
        <CircleCheck className="text-white fill-green-500 dark:fill-green-400" />
        { status }
      </>
        break;
    case "request for closing":
      return <>
        <CircleCheck />
        { status }
      </>
        break;
    case "open":
      return <>
        <Loader />
        { status }
      </>
        break;
    case "request for hold":
      return <>
        <Hand />
        { status }
      </>
        break;
    case "on-hold":
      return <>
        <Hand className="fill-yellow-300" />
        { status }
      </>
        break;
    case "cancelled":
      return <>
        <CircleX className="text-white fill-red-500 dark:fill-red-400" />
        { status }
      </>
        break;
    case "accepted":
      return <>
        <ThumbsUp />
        { status }
      </>
        break;
    default:
      return status;
  }
}

export const columns: ColumnDef<Transaction>[] = [
  { accessorKey: "id", 
    header: ({column}) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Series No.
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({row}) => {
      return <TableCellViewer item={row.original as Transaction} />;
    }
  },
  { accessorKey: "auditNo", header: "Audit Finding No."},
  { accessorKey: "status", 
    header: "Status",
    cell: ({row}) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        { getStatusLabel(row.original.status.toLowerCase()) }
      </Badge>
    )
  },
  { accessorKey: "company", header: "Company" },
  { accessorKey: "project", header: "Project / Department" },
  // { accessorKey: "resposiblePerson", header: "Responsible Person" },
  // { accessorKey: "engagement", header: "Audit Engagement" },
  // { accessorKey: "rating", header: "Audit Rating" },
  // { accessorKey: "category", header: "Findings Category" },
  // { accessorKey: "details", header: "Details of Findings" },
  // { accessorKey: "approvedDate", header: "Date Approved" },
]