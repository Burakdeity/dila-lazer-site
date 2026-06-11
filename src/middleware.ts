import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/hesabim") && !token) {
    const loginUrl = new URL("/giris", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.startsWith("/admin") && pathname !== "/admin/giris") {
    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/giris", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/hesabim/:path*", "/admin", "/admin/:path*"],
};
