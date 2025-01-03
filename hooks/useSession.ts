import { SessionContext } from '@/components/SessionProvider';
import { use } from 'react';

export function useSession() {
  return use(SessionContext);
}
