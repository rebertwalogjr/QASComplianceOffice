import { Prisma } from "../../generated/prisma/client";

export async function dbQuery<T>(query: Promise<T>) {
  try {
    const data = await query
    return { data, error: null }
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P1001':
        case 'P1008':
          return { data: null as T, error: "Database server is unreachable or timed out." }
        case 'P2002':
          return { data: null as T, error: "A record with this value already exists." }
        case 'P2003':
          return { data: null as T, error: "Cannot delete or update: related records exist." };
        default:
          return { data: null as T, error: `Database error (${error.code})` };
      }
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return { data: null as T, error: "Failed to connect to MSSQL. Check network/VPN or credentials."}
    }

    console.log(error)

    return { data: null as T, error: "An unexpected system error occured."}
  }
}