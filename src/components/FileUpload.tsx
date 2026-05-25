"use client"

import React, { useEffect, useState } from "react"
import { Download, FileText, Paperclip, Trash2, Undo2, X } from "lucide-react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { deleteTempFileAction, downloadFileAction, uploadFilesAction } from "@/server-actions/files"
import { toast } from "sonner"
import { IconSwitcher } from "@/lib/utils"
import path from 'path'

export interface Attachment {
  id: string | number
  fileName: string
  fileSize: number
  preview: string
  isDbRecord: boolean
  jobTransactionId?: number
  file?: File
  isMarkedForDeletion?: boolean
}

interface FileUploadProps {
  sessionId: string
  onFilesChange: (files: Attachment[]) => void
  initialAttachments?: {
    id: number
    jobTransactionId: number
    fileName: string
    fileSize: number
  }[] | null
}

export function FileUpload({ sessionId, onFilesChange, initialAttachments = [] }: FileUploadProps) {
  const [files, setFiles] = useState<Attachment[]>(() => {
    if (!initialAttachments) return []
    return initialAttachments?.map(att => ({
      id: att.id,
      fileName: att.fileName,
      fileSize: att.fileSize,
      isDbRecord: true,
      jobTransactionId: att.jobTransactionId,
      preview: "",
      isMarkedForDeletion: false
    }))
  })

  useEffect(() => {
    onFilesChange(files)
  }, [files, onFilesChange])

  useEffect(() => {
    if (initialAttachments && initialAttachments.length > 0 && files.length === 0) {
      const mapped = initialAttachments.map(att => ({
        id: att.id,
        fileName: att.fileName,
        fileSize: att.fileSize,
        isDbRecord: true,
        jobTransactionId: att.jobTransactionId,
        preview: "",
        isMarkedForDeletion: false
      }))
      setFiles(mapped)
    }
  }, [initialAttachments])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)
    const newFilesToUpload = selectedFiles.filter(
      (sf) => !files.some((f) => f.fileName === sf.name)
    )

    if (newFilesToUpload.length < selectedFiles.length) {
      toast.warning("Duplicate files were ignored.")
    }

    if (newFilesToUpload.length === 0) {
      e.target.value = ""
      return
    }

    // const uniqueInSelection = newFilesToUpload.filter(
    //   (file, index, self) => index === self.findIndex((t) => t.name === file.name)
    // )

    const formData = new FormData()
    // uniqueInSelection.forEach((file) => formData.append("attachments", file));
    // selectedFiles.forEach(file => formData.append("attachments", file))
    newFilesToUpload.forEach((file) => formData.append("attachments", file))

    try {
      const result = await uploadFilesAction(sessionId, formData)

      if (result.success) {
        const newUploadeFiles: Attachment[] = newFilesToUpload.map(file => ({
          id: `${file.name}-${file.size}-${Date.now()}`,
          fileName: file.name,
          fileSize: file.size,
          isDbRecord: false,
          file: file,
          preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "",
          isMarkedForDeletion: false
        }))
        setFiles(prev => [...prev, ...newUploadeFiles])
      } else {
        toast.error(result.error || "Failed to upload files.")
      }
    } catch (err) {
      toast.error("An error occured during the file upload.")
    } finally {
      e.target.value = ""
    }
  }

  const removeFile = async (targetFile: Attachment) => {
    if (targetFile.isDbRecord) {
      setFiles(prev => prev.map(f => f.id === targetFile.id ? { ...f, isMarkedForDeletion: !f.isMarkedForDeletion } : f))
      return
    }
    const result = await deleteTempFileAction(sessionId, targetFile.fileName)
    if (result.success) {
      if (targetFile.preview) {
        URL.revokeObjectURL(targetFile.preview)
      }
      setFiles(prev => prev.filter(f => f.id !== targetFile.id))
    } else {
      toast.error("Could not delete file from the server: " + result.error)
    }
  }

  const handleDownload = async (jobTransactionId: number | undefined, fileName: string) => {
    if (!jobTransactionId) {
      toast.error("Download is only available for saved transactions.")
      return
    }
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

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Paperclip className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500 font-semibold">Click to upload attachments</p>
            <p className="text-xs text-gray-400">PDF, PNG, JPG (Multiple allowed)</p>
          </div>
          <input type="file" multiple className="hidden" onChange={handleFileSelect} />
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {files.map((fileItem) => {
          const isDeleted = fileItem.isMarkedForDeletion
          return (
            <Card key={fileItem.id}
              className={`h-14 p-3 flex flex-row items-center justify-between group hover:border-primary/50 transition-colors shadow-none
                ${isDeleted ? "bg-red-50/40 border-red-200/60 opacity-60" : ""}`}
            >

              <div className="flex items-center overflow-hidden">
                <div className={`p-2 ${isDeleted ? "opacity-40" : ""}`}>
                  <i className={IconSwitcher(path.extname(fileItem.fileName))}></i>
                </div>
                <div className="flex flex-col overflow-hidden">
                  <div className={`flex items-center gap-2 `}>
                    <p className={`text-sm truncate ${isDeleted ? "line-through text-muted-foreground select-none" : ""}`}>{fileItem.fileName}</p>
                    <span className="text-xs text-muted-foreground">{(fileItem.fileSize / 1024).toFixed(1)} KB</span>
                    {fileItem.isDbRecord && (
                      <span className={`text-[10px] border px-1.5 rounded-sm shrink-0
                      ${isDeleted ? "bg-red-100 text-red-700 border-red-300" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                        Saved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                {fileItem.isDbRecord &&
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="Download"
                      onClick={() => handleDownload(fileItem.jobTransactionId, fileItem.fileName)}
                    >
                      <Download className="" />
                    </Button>
                  </div>
                }

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hover:bg-destructive"
                  onClick={() => removeFile(fileItem)}
                >
                  {isDeleted ? <Undo2 className="h-3 w-3" /> : <Trash2 className="h-3 w-3" />}
                </Button>
              </div>

            </Card>
          )
        })}
      </div>
    </div>
  )

}