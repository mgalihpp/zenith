'use client';

import Link from 'next/link';
import SearchBar from '@/components/Navbar/SearchBar';
import UserAvatar from '@/components/User/UserAvatar';
import { useSession } from '@/hooks/useSession';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = 'Zenith' }: NavbarProps) {
  const user = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const historyStack = useRef<string[]>([]);

  useEffect(() => {
    if (historyStack.current[historyStack.current.length - 1] !== pathname) {
      historyStack.current.push(pathname);
    }
  }, [pathname]);

  const shouldShowBackButton = () => {
    return pathname !== '/';
  };

  const handleBackClick = () => {
    historyStack.current.pop();
    const lastPath = historyStack.current.pop();
    if (lastPath) {
      router.push(lastPath);
    } else {
      router.back();
    }
  };

  return (
    <header className="sm:sticky top-0 z-10 bg-card shadow-sm">
      <div className="mx-auto flex items-center justify-between gap-5 px-5 py-3">
        {shouldShowBackButton() ? (
          <Button onClick={handleBackClick} variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        ) : (
          <UserAvatar avatarUrl={user?.avatarUrl} size={32} />
        )}
        <Link href="/" className="text-2xl font-bold text-primary">
          {title}
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
