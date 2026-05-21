import { DataTable } from "@/components/ui/data-table"
import { columns } from "./columns"
import { Label } from "@radix-ui/react-label"
import { getEscalations } from "@/server-actions/user"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, PlusCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function EscalationPage() {

  const escalationRes = await getEscalations()
  
    const users = escalationRes.data ?? []
  
    const error = escalationRes.error
    
  return (
    <div className="@container/main flex flex-col">
      {error ? (
        <div className="mt-6 mx-4">
          <Alert variant="destructive" className="bg-red-50 border-destructive">
            <AlertCircle />
            <AlertTitle>Connection Error</AlertTitle>
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <>
          <div className="flex flex-row px-6 pt-6 justify-between items-center">
            <Label className="text-md font-semibold text-foreground">Escalations</Label>
          </div>
          <div>
            <DataTable
              columns={columns}
              data={users}
            />
          </div>
        </>
      )}
    </div>
  )
}