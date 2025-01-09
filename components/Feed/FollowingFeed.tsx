'use client';

import { api } from '@/lib/api';
import { PostsPage } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import PostsLoadingSkeleton from '@/components/Post/PostsLoadingSkeleton';
import InfiniteScrollWrapper from '@/components/InfiniteScrollWrapper';
import Post from '@/components/Post/Post';
import { Loader2 } from 'lucide-react';

export default function FollowingFeed() {
  const {
    data,
    status,
    isFetching,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [''],
    queryFn: ({ pageParam }) =>
      api.get<PostsPage>(
        `/api/posts/following`,
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

  const posts = data?.pages.flatMap((page) => page.data?.posts) ?? [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />;
  }

  if (status === 'success' && !posts && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No one has posted anything yet.
      </p>
    );
  }

  if (status === 'error') {
    return (
      <p className="text-center text-destructive">
        An error occurred while loading posts.
      </p>
    );
  }

  return (
    <InfiniteScrollWrapper
      onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
    >
      <div className="divide-y">
        {posts.map((post) => (
          <Post post={post} key={post.id} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollWrapper>
  );
}
