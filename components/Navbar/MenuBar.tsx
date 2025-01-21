import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bookmark, Home } from 'lucide-react';
import NotificationsButton from './NotificationsButton';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';
import MessagesButton from './MessagesButton';
import streamServerClient from '@/lib/stream-chat';
import UserDropdown from '@/components/User/UserDropdown';
import UserAvatar from '@/components/User/UserAvatar';

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

      <UserDropdown>
        <div className="flex gap-4">
          <UserAvatar
            avatarUrl={user.avatarUrl}
            className="max-lg:w-6 max-lg:h-6 flex-none mx-auto w-10"
          />

          <div className="hidden lg:flex flex-col items-start">
            <span className="font-bold">{user.displayName}</span>
            <span className="text-muted-foreground">@{user.username}</span>
          </div>
        </div>
      </UserDropdown>
    </div>
  );
}
