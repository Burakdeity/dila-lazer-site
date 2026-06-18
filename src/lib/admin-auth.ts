import { getServerSession } from "next-auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export type AdminSession = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    role: string;
  };
};

export async function requireAdminSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "ADMIN") {
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role,
      },
    };
  }

  const headersList = await headers();
  const cookie = headersList.get("cookie") ?? "";
  const token = await getToken({
    req: { headers: { cookie } } as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token?.role === "ADMIN" && token.sub) {
    return {
      user: {
        id: token.sub,
        email: token.email,
        name: token.name,
        role: token.role as string,
      },
    };
  }

  return null;
}

export function adminUnauthorized() {
  return NextResponse.json(
    { error: "Yetkisiz erişim. Admin paneline tekrar giriş yapın." },
    { status: 401 }
  );
}
