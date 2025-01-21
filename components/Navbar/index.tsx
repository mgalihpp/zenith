'use client';

import Link from 'next/link';
import SearchBar from '@/components/Navbar/SearchBar';
import UserAvatar from '@/components/User/UserAvatar';
import { useSession } from '@/hooks/useSession';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

type NavbarProps = {
  title?: string;
};

export default function Navbar({ title = 'Zenith' }: NavbarProps) {
  const user = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    setLastScrollY(currentScrollY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY, handleScroll]);

  return (
    <header
      className={`sticky top-0 z-10 bg-card shadow-sm transition-transform duration-300 ${
        showNavbar ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="mx-auto flex items-center justify-between gap-5 px-5 py-3">
        {shouldShowBackButton() ? (
          <Button onClick={handleBackClick} variant="ghost" size="icon">
            <ChevronLeft />
          </Button>
        ) : (
          <Link
            href={`/user/${user?.username}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <UserAvatar avatarUrl={user?.avatarUrl} size={32} />
          </Link>
        )}
        <Link href="/" className="text-2xl font-bold text-primary">
          {title}
        </Link>
        <SearchBar />
      </div>
    </header>
  );
}
