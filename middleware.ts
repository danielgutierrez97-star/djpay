import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Permitir acceso al login
  if (pathname === "/backoffice/login") {
    return NextResponse.next();
  }

  // Verificar sesión
  const session = request.cookies.get("admin_session");

  if (!session) {
    return NextResponse.redirect(
      new URL("/backoffice/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/backoffice/:path*"],
};