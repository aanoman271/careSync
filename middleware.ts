import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If logged in, block access to login and register pages
  if (token && (pathname === "/login" || pathname.startsWith("/register"))) {
    if (token.role === "doctor") {
      return NextResponse.redirect(new URL("/doctor/dashboard", req.url));
    }
    if (token.role === "patient") {
      return NextResponse.redirect(new URL("/patient/dashboard", req.url));
    }
  }

  // Protect doctor routes — only doctors can access
  if (pathname.startsWith("/doctor") && token?.role !== "doctor") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect patient routes — only patients can access
  if (pathname.startsWith("/patient") && token?.role !== "patient") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Protect admin routes — only admins can access
  if (pathname.startsWith("/admin") && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// Which routes middleware will run on
export const config = {
  matcher: [
    "/login",
    "/register/:path*",
    "/doctor/:path*",
    "/patient/:path*",
    "/admin/:path*",
  ],
};
