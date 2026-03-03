import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      roles: string[]
      name: string
      employeeNumber: string
      isActivated: boolean
    } & DefaultSession['user']
  }

  interface User {
    roles: string[]
    isActivated: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    roles: string[]
    isActivated: boolean
  }
}