import { getFilterOptions } from "@/server-actions/common"
import ExportFilterContainer from "./filter-container"
import PageHeader from "@/components/page-header"
import ExportPageHeaderContent from "./page-header-content"

export default async function ExportPage() {
  const filterOptions = await getFilterOptions()

  return (
    <div className="@container/main flex-1 flex-col gap-2">
      <PageHeader>
        <ExportPageHeaderContent />
      </PageHeader>
      <div className="flex flex-col items-center p-6">
        <ExportFilterContainer options={filterOptions} />
      </div>
    </div>
  )
}