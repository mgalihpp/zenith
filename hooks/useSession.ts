import { SessionContext } from '@/components/SessionProvider';
import { useContext } from 'react';

export function useSession() {
  return useContext(SessionContext);
}
