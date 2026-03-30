import QASFilterSheet from "@/components/series/qas-filter-sheet";
import TransactionList from "./transaction-list"
import { getFilterOptions } from "@/server-actions/common";

export const dynamic = "force-dynamic"

export default async function TransactionPage(props: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {
  const filterOptions = await getFilterOptions()
  
  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <QASFilterSheet options={filterOptions} />
      {/* <Suspense fallback={<TableSkeleton/>}> */}
        <TransactionList searchParamsPromise={props.searchParams} />
      {/* </Suspense> */}
    </div>
  )
}