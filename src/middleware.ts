import { withAuth } from "next-auth/middleware"
import { NextResponse, NextRequest } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isActivated = token?.isActivated
    const { pathname } = req.nextUrl

    if (token && !isActivated && pathname !== "/activate") {
      return NextResponse.redirect(new URL("/activate", req.url))
    }

    if (token && isActivated && pathname === "/activate") {
      return NextResponse.redirect(new URL("/qas", req.url))
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

// export function proxy(request: NextRequest) {
//   const authToken = request.cookies.get("authToken")
//   const url = request.nextUrl.clone()

//   if(!authToken && url.pathname.includes('/qas')) {
//     url.pathname = '/signin'
//     return NextResponse.redirect(url)
//   }

//   return NextResponse.next()
// }

export const config = {
  matcher: [
    "/qas/:path",
    "/activate",
    "/",
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|signin).*)",
  ]
}