import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function TableSkeleton() {
  return (
    <div className="justify-start mt-2">
      <div className="px-6 z-40 w-full h-18 flex items-center">
        <div className="flex items-center w-100">
          <Skeleton className="h-9 w-full rounded-md bg-muted border" />
        </div>
      </div>

      <div className="overflow-auto rounded-md border  mx-6">
        <Table>
          <TableHeader className="bg-muted top-0">
            <TableRow>
              <TableHead className="w-[100px]"><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead><Skeleton className="h-4 w-full" /></TableHead>
              <TableHead className="text-right"><Skeleton className="h-4 w-full" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="h-12"><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell className="h-12"><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell className="h-12"><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell className="h-12"><Skeleton className="h-4 w-full" /></TableCell>
                <TableCell className="h-12"><Skeleton className="h-4 w-full" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}