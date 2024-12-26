'use client';

import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, Home } from 'lucide-react';

type MenuBarProps = {
  className?: string;
};

export default function MenuBar({ className }: MenuBarProps) {
  const user = useSession();

  if (!user) return null;

  // TODO: NOTIFICATION

  // TODO: NOTIFICATION

  return (
    <div className={className}>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Home"
        asChild
      >
        <Link href="/">
          <Home /> <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <Button
        variant="ghost"
        className="flex items-center justify-start gap-3"
        title="Bookmarks"
        asChild
      >
        <Link href="/bookmarks">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
    </div>
  );
}
