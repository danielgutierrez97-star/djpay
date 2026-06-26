import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   |--------------------------------------------------------------------------
   | BACKOFFICE
   |--------------------------------------------------------------------------
   */

  if (pathname.startsWith("/backoffice")) {
    if (pathname === "/backoffice/login") {
      return NextResponse.next();
    }

    const adminSession =
      request.cookies.get("admin_session");

    if (!adminSession) {
      return NextResponse.redirect(
        new URL("/backoffice/login", request.url)
      );
    }
  }

  /*
   |--------------------------------------------------------------------------
   | DASHBOARD DJ
   |--------------------------------------------------------------------------
   */

  if (pathname.startsWith("/dashboard")) {
    const djSession =
      request.cookies.get("dj_session");

    if (!djSession) {
      return NextResponse.redirect(
        new URL("/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/backoffice/:path*",
    "/dashboard/:path*",
  ],
};