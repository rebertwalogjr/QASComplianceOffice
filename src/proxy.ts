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

    // User is logged in but has not activated their account
    if (token && !isActivated && pathname !== "/activate") {
      const url = new URL("/activate", req.url)

      url.searchParams.set(
        "callbackUrl",
        pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
      )

      return NextResponse.redirect(url)
    }

    // User is already activated but somehow visits /activate
    if (token && isActivated && pathname === "/activate") {
      const callbackUrl = searchParams.get("callbackUrl") || "/qas"

      return NextResponse.redirect(new URL(callbackUrl, req.url))
    }

    // Admin authorization
    if (pathname.startsWith("/qas/admin")) {
      const isAdmin = userRoles?.includes(ADMIN_ROLE_ID)

      if (!isAdmin) {
        return NextResponse.rewrite(new URL("/qas/access-denied", req.url))
      }
    }

    // Auditor authorization
    if (pathname.startsWith("/qas/new")) {
      const isAuditor = userRoles?.includes(AUDITOR_ROLE_ID)

      if (!isAuditor) {
        return NextResponse.rewrite(new URL("/qas/access-denied", req.url))
      }
    }

    // Root of the website goes to the QAS application
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
    "/((?!api/auth|_next/static|_next/image|favicon.ico|DMCILogo.png|signin|forgotpassword).*)",
  ]
}