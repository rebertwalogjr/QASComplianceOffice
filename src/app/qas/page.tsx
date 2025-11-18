"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { useDataClient, useDataServer } from "@/hooks/get-list";
// import { cookies } from "next/headers";


export default function Default() {
  const qData = useDataClient()
  // const cookieStore = await cookies()
  // const savedPageSize = cookieStore.get("pageSize")?.value || "10";

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      {/* <div className="flex flex-col gap-4 py-6 md:gap-6 md:py-4"> */}
        <DataTable 
          columns={columns}
          data={qData} 
          // defaultPageSize={Number(savedPageSize)} 
        />
      </div>
    // </div>
  )
}