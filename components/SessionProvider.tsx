'use client';

import React, { cache, createContext, useEffect, useState } from 'react';
import { User } from '@prisma/client';
import { api } from '@/lib/api';

type Session = Omit<User, 'passwordHash'>;

export const SessionContext = createContext<Session | null>(null);

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const fetchSession = cache(async () => {
      const res = await api.get<Session>('/session');
      setSession(res.data ?? null);
    });

    fetchSession().catch((error) => console.error(error));
  }, []);

  return (
    <SessionContext.Provider value={session}>
      {children}
    </SessionContext.Provider>
  );
}
