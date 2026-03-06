import NextAuth, { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userRoles: number[]
      name: string
      employeeNumber: string
      isActivated: boolean
    } & DefaultSession['user']
  }

  interface User {
    id: string
    userRoles: number[]
    isActivated: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    userRoles: number[]
    isActivated: boolean
  }
}