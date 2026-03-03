"use client"

import { downloadFileAction } from "@/server-actions/files"
import { toast } from "sonner"
import { Card } from "./ui/card"
import { Download, FileText } from "lucide-react"
import { Button } from "./ui/button"
import { IconSwitcher } from "@/lib/utils"

interface Attachment {
  id: number
  fileName: string
  fileType: string
} 

interface AttachmentViewerProps {
  jobTransactionId: number
  attachments: Attachment[]
}

export default function AttachmentViewer({ jobTransactionId, attachments } : AttachmentViewerProps) {

  const handleDownload = async (fileName: string) => {
    try {
      const result = await downloadFileAction(jobTransactionId, fileName)
      const byteCharacters = atob(result.base64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray])
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild
    } catch (error) {
      toast.error("Error downloading file");
    }
  }

  if (attachments.length === 0) return <p className="text-sm text-muted-foreground">No attachments found</p>

  return (
    <div className="grid grid-col-1 lg:grid-cols-3 lg:gap-2 space-y-2 w-full">
      {attachments.map((file) => (
        <Card key={file.id} className="h-14 p-3 flex flex-row items-center justify-between group hover:border-primary/50 transition-colors shadow-none">
          <div className="flex items-center overflow-hidden">
            <div className="p-2">
              <i className={IconSwitcher(file.fileType)}></i>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm truncate">{file.fileName}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              title="Download"
              onClick={() => handleDownload(file.fileName)}
            >
              <Download className="" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  )
}