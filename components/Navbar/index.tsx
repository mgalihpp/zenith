'use client';

import Link from 'next/link';
import SearchBar from '@/components/Navbar/SearchBar';
import UserAvatar from '@/components/User/UserAvatar';
import { useSession } from '@/hooks/useSession';

export default function Navbar() {
  const user = useSession();

  return (
    <header className="sm:sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex items-center justify-between gap-5 px-5 py-3">
        <UserAvatar avatarUrl={user?.avatarUrl} size={32} />
        <Link href="/" className="text-2xl font-bold text-primary">
          Zenith
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
