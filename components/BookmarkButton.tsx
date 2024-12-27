import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { BookmarkInfo } from '@/types/bookmark';
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { Bookmark } from 'lucide-react';

type BookmarkButtonProps = {
  postId: string;
  initialState: BookmarkInfo;
};

export default function BookmarkButton(props: BookmarkButtonProps) {
  const { toast } = useToast();

  const queryClient = new QueryClient();

  const queryKey: QueryKey = ['bookmark-info', props.postId];

  const { data, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      api
        .get<BookmarkInfo>(`/api/posts/${props.postId}/bookmark`)
        .then((json) => json.data),
    initialData: props.initialState,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isBookmarkedByUser
        ? api.delete(`/api/posts/${props.postId}/bookmark`)
        : api.post(`/api/posts/${props.postId}/bookmark`),
    onMutate: async () => {
      toast({
        description: `Post ${data.isBookmarkedByUser ? 'un' : ''}bookmarked`,
      });

      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<BookmarkInfo>(queryKey);

      queryClient.setQueryData<BookmarkInfo>(queryKey, () => ({
        isBookmarkedByUser: !previousState?.isBookmarkedByUser,
      }));

      return { previousState };
    },
    onError: (error, _, ctx) => {
      queryClient.setQueryData(queryKey, ctx?.previousState);
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      });
    },
    onSuccess: () => refetch(),
  });

  return (
    <button
      className="flex items-center gap-2 disabled:cursor-not-allowed"
      onClick={() => mutate()}
      disabled={isFetching || isPending}
    >
      <Bookmark
        className={cn('size-5', {
          'fill-primary text-primary': data.isBookmarkedByUser,
        })}
      />
    </button>
  );
}
