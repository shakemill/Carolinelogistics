import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isApiRoute = req.nextUrl.pathname.startsWith("/api/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  // Public routes don't need auth
  if (!isAdminRoute && !isApiRoute) {
    return NextResponse.next()
  }

  // Allow access to login page
  if (isLoginPage) {
    return NextResponse.next()
  }

  // Check for session token cookie (NextAuth v5 uses different cookie names)
  const sessionToken = req.cookies.get("authjs.session-token") ||
                       req.cookies.get("__Secure-authjs.session-token") ||
                       req.cookies.get("next-auth.session-token") || 
                       req.cookies.get("__Secure-next-auth.session-token")

  // Protect admin routes (except login)
  if (isAdminRoute || isApiRoute) {
    if (!sessionToken) {
      const loginUrl = new URL("/admin/login", req.url)
      loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Role-based access will be checked in the page components
    // since we can't access session data in Edge middleware
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
  ],
}
