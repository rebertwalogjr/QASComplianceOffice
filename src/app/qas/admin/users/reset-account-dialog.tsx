import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { ResetPassword } from "@/server-actions/account"
import { toast } from "sonner"

type ResetAccountProps = {
  id: number
  employeeNumber: string
  email: string
  fullName: string
}

export default function ResetAccountDialog({ id, employeeNumber, email, fullName }: ResetAccountProps) {

  const onSubmit = async () => {
    const result = await ResetPassword(id)

    if (result.success) {
      toast.success(result.message, { position: "top-center" })
    } else {
      toast.error(result.message, { position: "top-center" })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Reset Account Password</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>

          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
            This will reset the account password from the server.
          </AlertDialogDescription>
          <Table>
            <TableBody>
              <TableRow>
                <TableCell><Label>Employee Number</Label></TableCell>
                <TableCell>{employeeNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Label>Email Address</Label></TableCell>
                <TableCell>{email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell><Label>Name</Label></TableCell>
                <TableCell>{fullName}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}