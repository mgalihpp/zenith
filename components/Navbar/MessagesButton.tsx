'use client';

import { MessageCountInfo, NotificationCountInfo } from '@/types/user';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

type MessagesButtonProps = {
  initialState: MessageCountInfo;
};

export default function MessagesButton(props: MessagesButtonProps) {
  const { data } = useQuery({
    queryKey: ['unread-messages-count'],
    queryFn: () =>
      api
        .get<NotificationCountInfo>('/api/messages/unread-count')
        .then((json) => json.data),
    initialData: props.initialState,
    refetchInterval: 60 * 1000,
  });

  return (
    <Button
      variant="ghost"
      className="flex items-center justify-start gap-3"
      title="Messages"
      asChild
    >
      <Link href="/messages">
        <div className="relative">
          <Mail />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
}
