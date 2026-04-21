import "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    url?: string;
    status?: string;
    redirect?: string;
    error?: string;
    tenantStatus?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    url?: string;
    status?: string;
    redirect?: string;
    error?: string;
    tenantStatus?: string | null;
  }
}
