
import NextAuth, { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { NextRequest, NextResponse } from "next/server"

// ---------------------------------------------------------------------------
// Rate limiter en memoria (persiste por proceso Node.js)
// Para deployments multi-instancia reemplazar con Upstash Redis o similar.
// ---------------------------------------------------------------------------
interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // ventana de 15 minutos
const MAX_ATTEMPTS = 10;           // máximo de intentos por ventana

// Limpieza periódica para evitar memory leaks en procesos de larga duración
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of loginAttempts.entries()) {
    if (now > record.resetAt) loginAttempts.delete(ip);
  }
}, WINDOW_MS);

function checkRateLimit(ip: string): { limited: boolean; retryAfterSecs: number } {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record || now > record.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { limited: false, retryAfterSecs: 0 };
  }

  if (record.count >= MAX_ATTEMPTS) {
    return { limited: true, retryAfterSecs: Math.ceil((record.resetAt - now) / 1000) };
  }

  record.count++;
  return { limited: false, retryAfterSecs: 0 };
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "127.0.0.1"
  );
}
// ---------------------------------------------------------------------------

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}oauth2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'password',
            client_id: process.env.NEXT_PUBLIC_AUTH_CLIENT_ID,
            client_secret: process.env.NEXT_PUBLIC_AUTH_SECRET_ID,
            username: credentials?.username,
            password: credentials?.password,
          }),
        })
        const user = await res.json()

        if (res.ok && user) {
            return {
              ...user,
              accessToken: user.access_token,
              refreshToken: user.refresh_token,
              expiresAt: user.expires_at,
              url: user.url,
              status: user.status,
              redirect: user.redirect
            }
        }
        return null
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.url = user.url;
        token.status = user.status;
        token.redirect = user.redirect;
      }
      return token
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.url = token.url;
      session.status = token.status;
      session.redirect = token.redirect;
      return session
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/',
  }
}

const handler = NextAuth(authOptions)

export const GET = handler

export async function POST(req: NextRequest, context: { params: { nextauth: string[] } }) {
  const isCredentialsCallback =
    context.params.nextauth?.join("/") === "callback/credentials";

  if (isCredentialsCallback) {
    const ip = getClientIp(req);
    const { limited, retryAfterSecs } = checkRateLimit(ip);

    if (limited) {
      const minutes = Math.ceil(retryAfterSecs / 60);
      return NextResponse.json(
        { error: `Demasiados intentos fallidos. Intenta de nuevo en ${minutes} min.` },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfterSecs) },
        }
      );
    }
  }

  return handler(req, context as any)
}

