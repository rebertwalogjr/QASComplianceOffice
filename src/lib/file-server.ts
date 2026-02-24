import fs from 'fs-extra'
import path from "path"

const ROOTH_PATH = process.env.FILE_SERVER_PATH || '\\Server\QASCompliance\TEST'
export const TEMP_FOLDER = path.join(ROOTH_PATH, 'Temporary')
export const FINAL_FOLDER = path.join(ROOTH_PATH, 'Attachments')

export async function saveToTemp(sessionId: string, file: File) {
  const dir = path.join(TEMP_FOLDER, sessionId)
  await fs.ensureDir(dir)

  const buffer = Buffer.from(await file.arrayBuffer())
  const filePath = path.join(dir, file.name)

  await fs.writeFile(filePath, buffer)
  return filePath
}

export async function promoteToFinal(sessionId: string, jobTransactionId: number) {
  const tempDir = path.join(TEMP_FOLDER, sessionId)
  const finalDir = path.join(FINAL_FOLDER, jobTransactionId.toString())

  if (await fs.pathExists(tempDir)) {
    await fs.ensureDir(finalDir)
    await fs.copy(tempDir, finalDir)
    await fs.remove(tempDir)
  }
}
