'use client';

import InfiniteScrollWrapper from '@/components/InfiniteScrollWrapper';
import PostsLoadingSkeleton from '@/components/Post/PostsLoadingSkeleton';
import { api } from '@/lib/api';
import { NotificationsPage } from '@/types/post';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import Notification from './Notification';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function Notifications() {
  const queryClient = useQueryClient();

  const {
    data,
    status,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['notifications'],
    queryFn: async ({ pageParam }) =>
      api.get<NotificationsPage>(
        '/api/notifications',
        pageParam
          ? {
              searchParams: {
                cursor: pageParam,
              },
            }
          : {}
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data.nextCursor,
  });

  const { mutate } = useMutation({
    mutationFn: () => api.patch('/api/notifications/mark-as-read'),
    onSuccess: () => {
      queryClient.setQueryData(['unread-notifications-count'], {
        unreadCount: 0,
      });
    },
    onError: () => {
      console.error('Failed to mark notifications as read');
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications =
    data?.pages.flatMap((page) => page.data.notifications) ?? [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />;
  }

  if (status === 'success' && !notifications.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications yet.
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading notifications.
      </p>
    );
  }

  return (
    <InfiniteScrollWrapper
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="divide-y border sm:rounded-2xl">
        {notifications.map((notification) => (
          <Notification key={notification.id} notification={notification} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollWrapper>
  );
}
