"use client"
import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useDataClient, useDataServer } from "@/hooks/get-list";

export default function Default() {
  const qData = useDataClient();
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable columns={columns} data={qData} />
      </div>
    </div>
  )
}