import { getUserDetails } from "@/server-actions/profile"
import SettingsContainer from "./settings-container"
import PageHeader from "@/components/page-header"
import SettingsPageHeaderContent from "./page-header-content"

export default async function SettingsPage() {
  const { data, error } = await getUserDetails()
  return (
    <div className="@container/main flex-1 flex-col gap-2">
      <PageHeader>
        <SettingsPageHeaderContent />
      </PageHeader>
      <div className="flex flex-col items-center p-6">
        <SettingsContainer userData={data} />
      </div>
    </div>
  )
}