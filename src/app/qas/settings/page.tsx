import { getUserDetails } from "@/server-actions/profile"
import SettingsContainer from "./settings-container"

export default async function SettingsPage() {
  const {data, error} = await getUserDetails()
  return (
    <div className="@container/main flex flex-col p-6 items-center">
        <SettingsContainer userData={data} />
    </div>
  )
}