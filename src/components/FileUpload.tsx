"use client"

import React, { useEffect, useState } from "react"
import { FileText, Paperclip, X } from "lucide-react"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { deleteTempFileAction, uploadFilesAction } from "@/prisma-actions/files"
import { toast } from "sonner"

export interface FileWithPreview {
  file: File
  preview: string
  id: string
}

interface FileUploadProps {
  sessionId: string
  onFilesChange: (files: FileWithPreview[]) => void
}

export function FileUpload({ sessionId, onFilesChange }: FileUploadProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])

  useEffect(() => {
    onFilesChange(files)
  }, [files, onFilesChange])

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return

    const selectedFiles = Array.from(e.target.files)
    const newFilesToUpload = selectedFiles.filter(
      (sf) => !files.some((f) => f.file.name === sf.name)
    )

    if (newFilesToUpload.length < selectedFiles.length) {
      toast.warning("Duplicate files were ignored.")
    }

    if (newFilesToUpload.length === 0) {
      e.target.value = ""
      return
    }

    const uniqueInSelection = newFilesToUpload.filter(
      (file, index, self) => index === self.findIndex((t) => t.name === file.name)
    )

    const formData = new FormData()
    uniqueInSelection.forEach((file) => formData.append("attachments", file));
    selectedFiles.forEach(file => formData.append("attachments", file))
    const result = await uploadFilesAction(sessionId, formData)

    if (result.success) {
      const newFiles: FileWithPreview[] = selectedFiles.map(file => ({
        file,
        id: `${file.name}-${file.size}-${Date.now()}`,
        preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : ""
      }))
      setFiles(prev => [...prev, ...newFiles])
    }
    e.target.value = ""
  }

  const removeFile = async (id: string, fileName: string) => {
    const result = await deleteTempFileAction(sessionId, fileName)
    if (result.success) {
      const fileToRemove = files.find(f => f.id === id)
      
      if(fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview)
      }

      setFiles(prev => prev.filter(f => f.id !== id))
    } else {
      toast.error("Could not delete file from the server: " + result.error)
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

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((fileItem) => (
          <Card key={fileItem.id} className="relative p-2 flex items-center gap-2 group">
            {fileItem.preview ? (
              <img src={fileItem.preview} className="h-12 w-12 object-cover rounded" />
            ) : (
              <FileText className="h-12 w-12 text-blue-500" />
            )}
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-medium truncate">{fileItem.file.name}</p>
              <p className="text-[10px] text-gray-400">{(fileItem.file.size / 1024).toFixed(1)} KB</p>
            </div>
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => removeFile(fileItem.id, fileItem.file.name)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )

}