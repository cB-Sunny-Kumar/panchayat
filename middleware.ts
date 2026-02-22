import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/auth";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login", "/", "/submit", "/track"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if it's a protected route
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path) || path.startsWith('/submit/success');

  const sessionCookie = request.cookies.get("session")?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  // Redirect authenticated users away from login page
  if (path === "/login" && session) {
    if (session.role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/admin", request.nextUrl));
    } else if (session.role === "OFFICER") {
      return NextResponse.redirect(new URL("/dashboard/officer", request.nextUrl));
    }
  }

  // Role-based Access Control (RBAC)
  if (session && path.startsWith("/dashboard")) {
    if (path.startsWith("/dashboard/admin") && session.role !== "ADMIN") {
      // Officer trying to access admin
      return NextResponse.redirect(new URL("/dashboard/officer", request.nextUrl));
    }
    
    if (path.startsWith("/dashboard/officer") && session.role !== "OFFICER") {
      // Admin trying to access officer
      return NextResponse.redirect(new URL("/dashboard/admin", request.nextUrl));
    }
  }

  return NextResponse.next();
}

// Configuration for matching paths
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
