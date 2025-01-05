'use client';

import InfiniteScrollWrapper from '@/components/InfiniteScrollWrapper';
import Post from '@/components/Post/Post';
import PostsLoadingSkeleton from '@/components/Post/PostsLoadingSkeleton';
import { api } from '@/lib/api';
import { PostsPage } from '@/types/post';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

type SearchResultProps = {
  q: string;
};

export default function SearchResult({ q }: SearchResultProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['post-feed', 'search', q],
    queryFn: ({ pageParam }) =>
      api
        .get<PostsPage>(`/api/search`, {
          searchParams: {
            q,
            ...(pageParam
              ? {
                  cursor: pageParam,
                }
              : {}),
          },
        })
        .then((json) => json.data),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    gcTime: 0,
    retry: 0,
  });

  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  if (status === 'pending') {
    return <PostsLoadingSkeleton />;
  }

  if (status === 'success' && !posts.length && !hasNextPage) {
    return (
      <p className="text-center text-muted-foreground">
        No posts found for this query.
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
      {isFetchingNextPage && <Loader2 className="mx-auto my-3 animate-spin" />}
    </InfiniteScrollWrapper>
  );
}
