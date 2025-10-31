import { NextRequest, NextResponse } from "next/server"
import { auth } from "./lib/auth"

const protectedRoutes = ["/profile", "/statistic", "/challenge"]

export default async function middleware(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl
  const isProtected = protectedRoutes.some(
    (route) => pathname.startsWith(route)
  )

  if(isProtected && !session) {
    return NextResponse.redirect(new URL("/auth", req.url))
  }


  return NextResponse.next()
}