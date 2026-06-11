import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const role = req.nextauth.token?.role;

    if (pathname.startsWith("/admin") && pathname !== "/admin/giris" && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/admin/giris", req.url));
    }
  },
  {
    pages: { signIn: "/admin/giris" },
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname === "/admin/giris") return true;
        if (pathname.startsWith("/admin")) return token?.role === "ADMIN";
        if (pathname.startsWith("/hesabim")) return !!token;

        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/hesabim/:path*", "/admin", "/admin/:path*"],
};
