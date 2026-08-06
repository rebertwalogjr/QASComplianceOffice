import QASFilterSheet from "@/app/qas/(main)/components/qas-filter-sheet"
import { SeriesSearchField } from "@/components/series/series-search-field"
import { getFilterOptions } from "@/server-actions/common"
import NewEntryButton from "./components/button-new-entry"

export default async function QASMasterListPageHeaderContent() {
  const filterOptions = await getFilterOptions()

  return (
    <div className="flex gap-2 justify-between items-center w-full">
      <SeriesSearchField />
      <div className="flex gap-2 items-center">
        <QASFilterSheet options={filterOptions} />
        <NewEntryButton />
      </div>
    </div>
  )
}