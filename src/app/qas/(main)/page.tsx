import { Suspense } from "react"

import Loading from "./loading"
import TransactionList from "./transaction-list"
import { TableSkeleton } from "@/components/table-skeleton";

export default async function TransactionPage(props: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {

  const searchParams = await props.searchParams

  const page = Number(searchParams.page) || 1
  const pageSize = Number(searchParams.pageSize) || 10

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <Suspense key={page + pageSize} fallback={<TableSkeleton />} >
        <TransactionList page={page} pageSize={pageSize} />
      </Suspense>
    </div>
  )
}