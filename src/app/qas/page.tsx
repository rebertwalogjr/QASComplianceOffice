"use client"

import { columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"
import { qas_series } from "@/dummy/qas-series";
import { useDataClient, useDataServer } from "@/hooks/get-list";
// import { cookies } from "next/headers";


export default function Default() {
  const qData = useDataClient()
  // const qasSeries = qas_series;
  // const cookieStore = await cookies()
  // const savedPageSize = cookieStore.get("pageSize")?.value || "10";

  return (

    <div className="@container/main flex flex-1 flex-col gap-2">
      {/* <div className="flex flex-col gap-4 py-6 md:gap-6 md:py-4"> */}
        <DataTable 
          columns={columns}
          data={qData}
          // defaultPageSize={Number(savedPageSize)} 
          getRowClassName={(row) => {
            if (row.status === "Closed" || row.status === "Cancelled") return "bg-accent"
            // if (row.status === "Open" && row.secondaryStatus === "New") return "bg-primary/20"
            return ""
          }}
        />
      </div>
    // </div>
  )
}