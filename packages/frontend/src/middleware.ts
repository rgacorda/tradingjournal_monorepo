// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_ROUTES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/verify-email",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("refreshToken")?.value;

  const isPublic =
    PUBLIC_ROUTES.includes(pathname);

  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/dashboard/main", req.url));
    }
    return NextResponse.next();
  } else {
    if (isPublic) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("expired", "1");
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"],
};
