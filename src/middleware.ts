import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { ENCRYPT_CLIENT_ID } from "./constants";
import { decryptText } from "./lib/encrypt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Define protected and public-only routes
const protectedRoutes = [
    "/accounts", 
    "/annexes", 
    "/cash", 
    "/cashdrawers", 
    "/contacts", 
    "/dashboard", 
    "/history", 
    "/invoicing", 
    "/orders", 
    "/products", 
    "/reports", 
    "/restaurant", 
    "/settings", 
    "/tools", 
    "/transfers", 
    "/protected", 
    "/protected-ssr",
    "/login",
  ];

  const publicOnlyRoutes = ["/"]; // The login page
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  // --- Redirect authenticated users from public-only routes ---
  if (token && publicOnlyRoutes.includes(pathname)) {
    // If user is logged in and tries to access login page, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // --- Redirect unauthenticated users from protected routes ---
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // --- Verify tenant status for authenticated users on protected routes ---
  if (token && isProtectedRoute) {
    const tenantStatus = decryptText(req.cookies.get("tenant-status")?.value || "", ENCRYPT_CLIENT_ID);
    if (tenantStatus === "Suspended") {
      return NextResponse.redirect(new URL("/redirects/suspended", req.url));
    }
    if (tenantStatus === "Overdue") {
      return NextResponse.redirect(new URL("/redirects/overdue", req.url));
    }
  }

  // Allow other requests
  return NextResponse.next();
}

// This config ensures the middleware runs on all necessary routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
