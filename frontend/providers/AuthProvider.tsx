'use client';

import React, { useEffect } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { useAuthStore } from '@/stores/auth.store';

function AuthSync() {
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    if (status === 'authenticated' && session?.user && session?.accessToken) {
      setAuth(
        session.user as any,
        session.accessToken,
        session.refreshToken || ''
      );
    }
  }, [session, status, setAuth]);

  return null;
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthSync />
      {children}
    </SessionProvider>
  );
}
