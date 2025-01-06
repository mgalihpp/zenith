'use client';

import InfiniteScrollWrapper from '@/components/InfiniteScrollWrapper';
import Post from '@/components/Post/Post';
import PostsLoadingSkeleton from '@/components/Post/PostsLoadingSkeleton';
import { api } from '@/lib/api';
import { PostsPage } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type UserPostsProps = {
  userId: string;
};

export default function UserPosts(props: UserPostsProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['post-feed', 'user-posts', props.userId],
    queryFn: ({ pageParam }) =>
      api.get<PostsPage>(
        `/api/users/${props.userId}/posts`,
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
        This user hasn&apos;t posted anything yet.
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
          <Post key={post.id} post={post} />
        ))}
      </div>
      {isFetchingNextPage && <Loader2 className="animate-spin mx-auto my-3" />}
    </InfiniteScrollWrapper>
  );
}
