'use client';

import { SessionProvider, useSession } from 'next-auth/react';
import { useThemeStore } from '@/stores/themeStore';
import { useEffect } from 'react';
import sessionStore from '@/stores/sessionStore';

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
    if (session?.accessToken && session?.url) {
      setSession(session.accessToken, session.url);
    } else {
      clearSession();
    }
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
