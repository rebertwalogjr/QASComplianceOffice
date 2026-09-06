import { PrismaMssql } from "@prisma/adapter-mssql"
import { PrismaClient } from "../../generated/prisma/client"

let prisma: PrismaClient | undefined

export function getPrisma(): PrismaClient {
  if (!prisma) {
    const DB_USER = process.env.DB_USER
    const DB_PASSWORD = process.env.DB_PASSWORD
    const DB_NAME = process.env.DB_NAME
    const DB_HOST = process.env.DB_HOST
    const DB_PORT = process.env.DB_PORT || "1433"

    if (!DB_USER) {
      throw new Error("DB_USER environment variable is not configured")
    }

    if (!DB_PASSWORD) {
      throw new Error("DB_PASSWORD environment variable is not configured")
    }

    if (!DB_NAME) {
      throw new Error("DB_NAME environment variable is not configured")
    }

    if (!DB_HOST) {
      throw new Error("DB_HOST environment variable is not configured")
    }

    const sqlConfig = {
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      server: DB_HOST,
      port: parseInt(DB_PORT, 10),
      pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
      },
      options: {
        encrypt: true,
        trustServerCertificate: true,
      },
    }

    const adapter = new PrismaMssql(sqlConfig)

    prisma = new PrismaClient({ adapter })
  }

  return prisma
}