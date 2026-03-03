"use server"

import { saveToTemp, TEMP_FOLDER, FINAL_FOLDER } from "@/lib/file-server";
import fs from 'fs-extra'
import path from "path"

export async function uploadFilesAction(sessionId: string, formData: FormData) {
  const files = formData.getAll("attachments") as File[]
  try {
    for (const file of files) {
      await saveToTemp(sessionId, file)
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to upload to temp folder: " + error }
  }
}

export async function deleteTempFileAction(sessionId: string, fileName: string) {
  try {
    const filePath = path.join(TEMP_FOLDER, sessionId, fileName)
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath)
      return { success: true }
    }
    return { success: false, error: "File not found."}
  } catch (error) {
    return { success: false, error: "Failed to delete file: " + error}
  }
}

export async function deleteTempFolderBySessionId(sessionId: string) {
  const tempDir = path.join(TEMP_FOLDER, sessionId)

  if (await fs.pathExists(tempDir)) {
    await fs.remove(tempDir)
  }
}

export async function downloadFileAction(jobTransactionId: number, filename: string) {
  const filepath = path.join(FINAL_FOLDER, jobTransactionId.toString(), filename)

  try {
    if (!(await fs.pathExists(filepath))) {
      throw new Error("File not found on server!")
    }

    const fileBuffer = await fs.readFile(filepath)
    const base64 = fileBuffer.toString('base64')

    return {
      filename,
      base64,
      contentType: path.extname(filename)
    }
  } catch (error) {
    throw new Error("Could not download file.")
  }
}