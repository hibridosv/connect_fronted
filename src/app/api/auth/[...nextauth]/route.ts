
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // console.log("Attempting to authorize...");
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}oauth2`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            grant_type: 'password',
            client_id: process.env.AUTH_CLIENT_ID,
            client_secret: process.env.AUTH_SECRET_ID,
            username: credentials?.username,
            password: credentials?.password,
          }),
        })
        // console.log("Backend response status:", res.status);
        const user = await res.json()
        // console.log("Backend response body:", user);

        if (res.ok && user) {
          // console.log("Authorization successful.");
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
        // console.log("Authorization failed.");
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
      // console.log("Redirecting to:", url, "from base URL:", baseUrl);
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  },
  pages: {
    signIn: '/',
  }
})

export { handler as GET, handler as POST }

