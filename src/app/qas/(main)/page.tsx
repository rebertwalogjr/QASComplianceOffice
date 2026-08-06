import TransactionList from "./components/transaction-list"
import { getFilterOptions } from "@/server-actions/common"
import QASMasterListSiteHeaderContent from "./page-header-content"
import PageHeader from "@/components/page-header"
import { Label } from "@/components/ui/label"

export const dynamic = "force-dynamic"

export default async function TransactionPage(props: { searchParams: Promise<{ page?: string; pageSize?: string }> }) {
  const filterOptions = await getFilterOptions()

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <PageHeader>
        <QASMasterListSiteHeaderContent />
      </PageHeader>
      <div className="mx-6 mt-4">
        <Label className="text-lg">QAS Master List</Label>
      </div>
      <TransactionList searchParamsPromise={props.searchParams} />
    </div>
  )
}