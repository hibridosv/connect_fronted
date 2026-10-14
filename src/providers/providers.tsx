'use client';

import { SessionProvider, getSession, useSession } from 'next-auth/react';
import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from 'react';
import sessionStore from '@/stores/sessionStore';
import { safeSignOut } from '@/lib/safeSignOut';

const SESSION_RETRY_ATTEMPTS = 2;
const SESSION_RETRY_DELAY_MS = 1500;

type Props = {
  children?: React.ReactNode;
};

function ThemeManager({ children }: Props) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return <>{children}</>;
}

function SessionSyncer() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'loading') return;
    const { setSession, clearSession } = sessionStore.getState();

    if (session?.error === 'RefreshAccessTokenError') {
      clearSession();
      safeSignOut();
      return;
    }

    if (session?.accessToken && session?.url) {
      setSession(session.accessToken, session.url);
      return;
    }

    if (!sessionStore.getState().accessToken) {
      clearSession();
      return;
    }

    // Losing a session that was active can be a transient failure of the
    // window-focus refetch of /api/auth/session, so confirm it before dropping
    // the tenant url and token.
    let cancelled = false;
    (async () => {
      for (let i = 0; i < SESSION_RETRY_ATTEMPTS; i++) {
        await new Promise((resolve) => setTimeout(resolve, SESSION_RETRY_DELAY_MS));
        if (cancelled) return;
        const retry = await getSession();
        if (cancelled) return;
        if (retry?.accessToken && retry?.url) {
          setSession(retry.accessToken, retry.url);
          return;
        }
      }
      clearSession();
      safeSignOut();
    })();

    return () => {
      cancelled = true;
    };
  }, [session, status]);

  return null;
}

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <SessionSyncer />
      <ThemeManager>{children}</ThemeManager>
    </SessionProvider>
  );
};
