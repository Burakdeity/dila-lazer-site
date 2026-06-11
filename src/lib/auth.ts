import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/user-store";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/giris",
    error: "/giris",
  },
  providers: [
    CredentialsProvider({
      name: "E-posta ve Şifre",
      credentials: {
        email: { label: "E-posta", type: "email" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("E-posta ve şifre gereklidir");
        }

        const email = credentials.email.toLowerCase().trim();

        const user = await findUserByEmail(email);

        if (!user) {
          throw new Error("E-posta veya şifre hatalı");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

        if (!isValid) {
          throw new Error("E-posta veya şifre hatalı");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          loyaltyTier: user.loyaltyTier,
          points: user.points,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.loyaltyTier = user.loyaltyTier;
        token.points = user.points;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.loyaltyTier = token.loyaltyTier as string;
        session.user.points = token.points as number;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
