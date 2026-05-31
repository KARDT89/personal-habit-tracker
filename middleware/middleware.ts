import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {getSessionCookie} from 'better-auth/cookies'

export function middleware(request: NextRequest) {
  const session = getSessionCookie(request)
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  const isProtected = pathname.startsWith("/dashboard") ||
    pathname.startsWith("/habits") ||
    pathname.startsWith("/stats");

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/habits/:path*", "/stats/:path*", "/sign-in", "/sign-up"],
};