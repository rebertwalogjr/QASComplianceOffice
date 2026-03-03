import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function getUserId() {
  const session = await getSession()

  if (!session?.user.id) return null

  return parseInt(session.user.id)
}