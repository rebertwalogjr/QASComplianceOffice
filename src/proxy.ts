import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

const AUDITOR_ROLE_ID = 1001
const ADMIN_ROLE_ID = 1005

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isActivated = token?.isActivated
    const userRoles = token?.userRoles as number [] | undefined

    const { pathname, searchParams } = req.nextUrl
    const callbackUrl = searchParams.get("callbackUrl") || "/qas"

    if (token && !isActivated && pathname !== "/activate") {
      const url = new URL("/activate", req.url)
      url.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(url)
    }

    if (token && isActivated && pathname === "/activate") {
      return NextResponse.redirect(new URL(callbackUrl, req.url))
    }

    if (pathname.startsWith("/qas/admin")) {
      const isAdmin = userRoles?.includes(ADMIN_ROLE_ID)
      if (!isAdmin) {
        return NextResponse.rewrite(new URL("/qas/access-denied", req.url))
      }
    }

    if (pathname.startsWith("/qas/new")) {
      const isAuditor = userRoles?.includes(AUDITOR_ROLE_ID)
      if (!isAuditor) {
        return NextResponse.rewrite(new URL("/qas/access-denied", req.url))
      }
    }

    if (pathname === "/") {
      return NextResponse.redirect(new URL("/qas", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/signin"
    }
  }
)

export const config = {
  matcher: [
    "/qas/:path*",
    "/activate",
    "/qas/admin/:path*",
    "/",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|DMCILogo.png|signin).*)",
  ]
}