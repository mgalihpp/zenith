'use client';

import InfiniteScrollWrapper from '@/components/InfiniteScrollWrapper';
import Post from '@/components/Post/Post';
import PostsLoadingSkeleton from '@/components/Post/PostsLoadingSkeleton';
import { api } from '@/lib/api';
import { PostsPage } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

export default function Bookmarks() {
  const {
    data,
    status,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['post-feed', 'bookmarks'],
    queryFn: async ({ pageParam }) =>
      api.get<PostsPage>(
        '/api/posts/bookmarked',
        pageParam
          ? {
              searchParams: {
                cursor: pageParam,
              },
            }
          : {}
      ),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.data?.nextCursor,
  });

  const posts = data?.pages.flatMap((page) => page.data.posts) ?? [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />;
  }

  if (status === 'success' && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any bookmarks yet.
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading bookmarks.
      </p>
    );
  }

  return (
    <InfiniteScrollWrapper
      className="space-y-5"
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="divide-y border">
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollWrapper>
  );
}
