import { PostData } from '@/types/post';
import { Loader2 } from 'lucide-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { CommentPage } from '@/types/comment';
import Comment from './Comment';
import { Button } from '@/components/ui/button';

type CommentsProps = {
  post: PostData;
};

export default function Comments(props: CommentsProps) {
  const { data, fetchNextPage, hasNextPage, status, isFetching } =
    useInfiniteQuery({
      queryKey: ['comments', props.post.id],
      queryFn: ({ pageParam }) =>
        api.get<CommentPage>(
          `/api/posts/${props.post.id}/comments`,
          pageParam
            ? {
                searchParams: {
                  cursor: pageParam,
                },
              }
            : {}
        ),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.data.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const comments = data?.pages.flatMap((page) => page.data.comments) ?? [];

  return (
    <div
      className="space-y-3 border-t pt-2"
      onClick={(e) => e.stopPropagation()}
    >
      {hasNextPage && (
        <Button
          variant="link"
          className="mx-auto block"
          disabled={isFetching}
          onClick={() => fetchNextPage()}
        >
          Load previous comments
        </Button>
      )}
      {status === 'pending' && <Loader2 className="mx-auto animate-spin" />}
      {status === 'success' && !comments.length && (
        <p className="text-center text-muted-foreground">No comments yet.</p>
      )}
      {status === 'error' && (
        <p className="text-center text-destructive">
          An error occurred while loading comments.
        </p>
      )}
      <div className="divide-y">
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
