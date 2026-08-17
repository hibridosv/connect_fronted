import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- Maintenance mode ---
  if (process.env.MAINTENANCE_MODE === "true" && !pathname.startsWith("/redirects/maintenance")) {
    return NextResponse.redirect(new URL("/redirects/maintenance", req.url));
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

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
    "/maintenance",
    "/orders",
    "/products",
    "/reports", 
    "/restaurant", 
    "/settings", 
    "/tools", 
    "/transfers", 
    "/protected", 
    "/protected-ssr",
    "/help",
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
    const tenantStatus = token?.tenantStatus;
    if (tenantStatus === "Suspended") {
      return NextResponse.redirect(new URL("/redirects/suspended", req.url));
    }
    if (tenantStatus === "Overdue") {
      return NextResponse.redirect(new URL("/redirects/overdue", req.url));
    }
    if (tenantStatus === "Info") {
      return NextResponse.redirect(new URL("/redirects/info", req.url));
    }
    if (tenantStatus === "Expiring") {
      return NextResponse.redirect(new URL("/redirects/expiring", req.url));
    }
  }

  // --- Redirect /login to root ---
  if (pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // --- Redirect legacy /sales routes ---
  if (pathname.startsWith("/sales/quick") || pathname.startsWith("/sales/orders")) {
    return NextResponse.redirect(new URL("/orders", req.url));
  }

  // Allow other requests
  return NextResponse.next();
}

// This config ensures the middleware runs on all necessary routes
export const config = {
  matcher: [
    "/",
    "/login",
    "/sales/:path*",
    "/accounts/:path*",
    "/annexes/:path*",
    "/cash/:path*",
    "/cashdrawers/:path*",
    "/contacts/:path*",
    "/dashboard/:path*",
    "/history/:path*",
    "/invoicing/:path*",
    "/maintenance/:path*",
    "/orders/:path*",
    "/products/:path*",
    "/reports/:path*",
    "/restaurant/:path*",
    "/settings/:path*",
    "/tools/:path*",
    "/transfers/:path*",
    "/protected/:path*",
    "/protected-ssr/:path*",
    "/help/:path*",
  ],
};
