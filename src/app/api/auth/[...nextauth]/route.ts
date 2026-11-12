
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Estados de billing que muestran un aviso con "Continuar"; Suspended no esta porque bloquea el sistema
const DISMISSIBLE_STATUSES = ['Info', 'Expiring', 'Overdue'];
const REFRESH_MARGIN_MS = 30_000;

async function refreshAccessToken(token: any) {
  try {
    const res = await fetch(`${token.url}/oauth/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken,
        client_id: process.env.AUTH_CLIENT_ID,
        client_secret: process.env.AUTH_SECRET_ID,
        scope: '',
      }),
    })

    if (!res.ok) {
      throw new Error(`Refresh failed with status ${res.status}`)
    }

    const refreshed = await res.json()

    return {
      ...token,
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + refreshed.expires_in * 1000,
      error: undefined,
    }
  } catch {
    return { ...token, accessToken: undefined, refreshToken: undefined, error: 'RefreshAccessTokenError' }
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        change: { label: "Change URL", type: "text" },
      },
      async authorize(credentials) {
        // La URL nunca sale de lo que manda el cliente: aqui viajan el client_id y el client_secret
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}oauth2`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            grant_type: 'password',
            client_id: process.env.AUTH_CLIENT_ID,
            client_secret: process.env.AUTH_SECRET_ID,
            username: credentials?.username,
            password: credentials?.password,
            ...(credentials?.change ? { change: credentials.change } : {}),
          }),
        })

        const user = await res.json()

        if (res.ok && user) {
          return {
            ...user,
            accessToken: user.access_token,
            refreshToken: user.refresh_token,
            expiresAt: Date.now() + user.expires_in * 1000,
            url: user.url,
            status: user.status,
            redirect: user.redirect,
          }
        }
        throw new Error(user?.message || user?.error_description || 'Usuario o contraseña incorrectos')
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, session, trigger }: any) {
      if (trigger === "update" && session?.tenantStatus !== undefined) {
        // El cliente solo puede descartar un aviso; la suspension no se quita desde el navegador
        if (session.tenantStatus === 'Active' && DISMISSIBLE_STATUSES.includes(token.tenantStatus)) {
          token.tenantStatus = 'Active';
        }
        return token;
      }

      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.url = user.url;
        token.status = user.status;
        token.redirect = user.redirect;
        token.tenantStatus = user.status ?? null;
        return token
      }

      // Margen por si el reloj del servidor va adelantado: renueva antes de que connect lo rechace
      if (Date.now() < token.expiresAt - REFRESH_MARGIN_MS) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.url = token.url;
      session.status = token.status;
      session.redirect = token.redirect;
      session.error = token.error;
      session.tenantStatus = token.tenantStatus;
      return session
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  events: {
    // Corre en el servidor con cualquier signOut(): revoca el token en connect para que no sirva aunque alguien lo haya copiado
    async signOut({ token }: any) {
      if (!token?.accessToken || !token?.url) return;
      try {
        await fetch(`${token.url}/api/v2/logout`, {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token.accessToken}` },
          signal: AbortSignal.timeout(5000),
        });
      } catch {
        // Si connect no responde el usuario sale igual; el token vence solo
      }
    },
  },
  pages: {
    signIn: '/',
  }
})

export { handler as GET, handler as POST }

