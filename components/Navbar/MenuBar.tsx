import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, Home } from 'lucide-react';
import NotificationsButton from './NotificationsButton';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';
import MessagesButton from './MessagesButton';
import streamServerClient from '@/lib/stream-chat';

type MenuBarProps = {
  className?: string;
};

export default async function MenuBar({ className }: MenuBarProps) {
  const { user } = await getSession();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    new NotificationService().getNotificationsCount(user.id),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);

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
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
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
