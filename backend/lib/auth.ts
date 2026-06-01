/**
 * Toilet.uz — NextAuth (Auth.js v5) konfiguratsiyasi
 * --------------------------------------------------------------------------
 * Asosiy chiqishlar:
 *   handlers  → app/api/auth/[...nextauth]/route.ts  uchun GET, POST
 *   auth()    → route va server component'larda session olish
 *   signIn / signOut  → server action'lar uchun
 *   requireSession()  → himoyalangan API endpointlar uchun helper
 */

import NextAuth, { type NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  constructor(message = 'Forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

// Login email'i shu ro'yxatda bo'lsa, foydalanuvchi avtomatik ADMIN bo'ladi.
const ADMIN_EMAILS = new Set(
  (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

const providers: NextAuthConfig['providers'] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    })
  );
}

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers,
  session: { strategy: 'database' },
  events: {
    // Email ADMIN_EMAILS'da bo'lsa rolni ADMIN'ga ko'taramiz (faqat ko'tarish).
    async signIn({ user }) {
      if (!user.email) return;
      if (!ADMIN_EMAILS.has(user.email.toLowerCase())) return;
      await prisma.user.updateMany({
        where: { email: user.email, role: { not: 'ADMIN' } },
        data: { role: 'ADMIN' },
      });
    },
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = (user as { role?: 'USER' | 'ADMIN' }).role ?? 'USER';
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the URL is relative, redirect to the frontend
      if (url.startsWith('/')) {
        return `${FRONTEND_URL}${url}`;
      }
      // If already pointing to frontend, allow it
      if (url.startsWith(FRONTEND_URL)) {
        return url;
      }
      // If pointing to backend, allow it (e.g. OAuth callback)
      if (url.startsWith(baseUrl)) {
        return url;
      }
      // Default: go to frontend home
      return FRONTEND_URL;
    },
  },
  trustHost: true,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

/* ────────────  Server-side helpers  ──────────── */

export async function getSessionUser() {
  const session = await auth();
  return session?.user ?? null;
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  return { user: session.user as { id: string; name?: string | null; email?: string | null; image?: string | null } };
}

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) throw new UnauthorizedError();
  if (session.user.role !== 'ADMIN') throw new ForbiddenError();
  return { user: session.user };
}

/* ────────────  Type augmentation  ──────────── */

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'USER' | 'ADMIN';
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
