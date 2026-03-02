import Credentials from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthOptions } from "next-auth"

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if(!credentials?.username || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { username: credentials.username },
          include: { userRoles: { include: { role: true } } }
        })

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
          throw new Error("Invalid username or password")
        }

        if(!user.isActive) {
          throw new Error("This account is inactive. Pleace contact your administrator.")
        }

        return {
          id: user.id.toString(),
          username: user.username,
          isActivated: user.isActivated,
          roles: user.userRoles.map((ur: any) => ur.role.name)
        }

      }
    })
  ],
  callbacks: {
    async jwt({ token, user }  : any) {
      if (user) {
        token.id = user.id
        token.roles = user.roles
        token.isActivated = user.isActivated
      }
      return token
    },
    async session({ session, token } : any) {
      if (token) {
        session.user.id = token.id
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