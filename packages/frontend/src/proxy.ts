// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("refreshToken")?.value;

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  // Don't check auth for public routes
  if (isPublic) {
    // If already logged in, redirect away from auth pages
    if (token && (pathname === "/login" || pathname === "/register")) {
      return NextResponse.redirect(new URL("/dashboard/main", req.url));
    }
    return NextResponse.next();
  }

  // For protected routes, check if token exists
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api|.*\\..*).*)"],
};
