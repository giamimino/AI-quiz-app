import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

const protectedRoutes = ["/profile", "/statistic", "/challenge"]

export default async function middleware(req: NextRequest) {
  const cookieStore = await cookies()
  const session = cookieStore.get("authjs.session-token")
  const { pathname } = req.nextUrl
  const isProtected = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  )

  if(isProtected && !session) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }

  return NextResponse.next()
}