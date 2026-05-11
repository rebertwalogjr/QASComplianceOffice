import { getFilterOptions } from "@/server-actions/common"
import ExportFilterContainer from "./filter-container"

export default async function ExportPage() {
  const filterOptions = await getFilterOptions()

  return (
    <div className="@container/main flex flex-1 flex-col gap-2">
      <ExportFilterContainer options={filterOptions} />
    </div>
  )
}