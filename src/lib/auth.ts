import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth"
import { toTitleCase } from "./utils"

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            password: true,
            isActivated: true,
            isActive: true,
            employeeNumber: true,
            userRoles: {
              where: { isActive: true },
              select: { role: true }
            },
            appSuiteEmployeeMaster: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          },
        })

        // ERROR CHECK 1: Did we find the user?
        if (!user) return null;

        // ERROR CHECK 2: Is the bcrypt comparison correct?
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
        if (!isPasswordValid) return null

        // EROR CHECK 3: Is the user account activated?
        // if (!user.isActivated) {
        //   throw new Error("ACCOUNT_NEEDS_ACTIVATION")
        // }

        // ERROR CHECK 4: Is the user account inactive?
        // if (!user.isActive) {
        //   throw new Error("ACCOUNT_INACTIVE")
        // }

        const emp = user.appSuiteEmployeeMaster
        const firstName = toTitleCase(emp?.firstName)
        const lastName = toTitleCase(emp?.lastName)

        return {
          id: user.id.toString(),
          name: `${firstName} ${lastName}`.trim() || user.username,
          username: user.username,
          isActivated: user.isActivated,
          roles: user.userRoles.map((ur: any) => ur.role.name)
        }

      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.isActivated = user.isActivated
      }
      if (trigger === "update" && session?.user) {
        const dbUser = await prisma.user.findUnique({
          where: { id: Number(token.id) },
          select: { isActivated: true }
        })
        if (dbUser) {
          token.isActivated = dbUser.isActivated
        }
      }
      return token
    },
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id as string
        session.user.roles = token.roles
        session.user.isActivated = token.isActivated
      }
      return session
    }
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 60,
    updateAge: 5 * 60,
  },
  pages: {
    signIn: "/signin"
  }
}