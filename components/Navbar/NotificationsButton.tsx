'use client';

import { NotificationCountInfo } from '@/types/user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type NotificationsButtonProps = {
  initialState: NotificationCountInfo;
};

export default function NotificationsButton(props: NotificationsButtonProps) {
  const { data } = useQuery({
    queryKey: ['unread-notification-count'],
    queryFn: () =>
      api
        .get<NotificationCountInfo>('/api/notifications/unread-count')
        .then((json) => json.data),
    initialData: props.initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Notifications"
      asChild
    >
      <Link href="/notifications">
        <div className="relative">
          <Bell />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Notification</span>
      </Link>
    </Button>
  );
}
