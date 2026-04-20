
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

async function refreshAccessToken(token: any) {
  const res = await fetch(`${token.url}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
      client_id: process.env.AUTH_CLIENT_ID,
      client_secret: process.env.AUTH_SECRET_ID,
      scope: '',
    }),
  })

  const refreshed = await res.json()

  if (!res.ok) {
    return { ...token, error: 'RefreshAccessTokenError' }
  }

  return {
    ...token,
    accessToken: refreshed.access_token,
    refreshToken: refreshed.refresh_token,
    expiresAt: Date.now() + refreshed.expires_in * 1000,
    error: undefined,
  }
}

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        tenantUrl: { label: "Tenant URL", type: "text" },
        change: { label: "Change URL", type: "text" },
      },
      async authorize(credentials) {
        const baseUrl = credentials?.tenantUrl ?? process.env.NEXT_PUBLIC_URL_API;
        const res = await fetch(`${baseUrl}oauth2`, {
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
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
        token.url = user.url;
        token.status = user.status;
        token.redirect = user.redirect;
        return token
      }

      if (Date.now() < token.expiresAt) {
        return token
      }

      return refreshAccessToken(token)
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.expiresAt = token.expiresAt;
      session.url = token.url;
      session.status = token.status;
      session.redirect = token.redirect;
      session.error = token.error;
      return session
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/',
  }
})

export { handler as GET, handler as POST }

