import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { LikeInfo } from '@/types/post';
import {
  QueryClient,
  QueryKey,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import { Heart } from 'lucide-react';

type LikeButtonProps = {
  postId: string;
  initialState: LikeInfo;
};

export default function LikeButton(props: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = new QueryClient();

  const queryKey: QueryKey = ['like-info', props.postId];

  const { data, refetch, isFetching } = useQuery({
    queryKey,
    queryFn: () =>
      api
        .get<LikeInfo>(`/api/posts/${props.postId}/likes`)
        .then((json) => json.data),
    initialData: props.initialState,
    staleTime: Infinity,
  });

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isLikedByUser
        ? api.delete(`/api/posts/${props.postId}/likes`)
        : api.post(`/api/posts/${props.postId}/likes`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<LikeInfo>(queryKey);

      queryClient.setQueryData<LikeInfo>(queryKey, () => ({
        likes:
          (previousState?.likes || 0) + (previousState?.isLikedByUser ? -1 : 1),
        isLikedByUser: !previousState?.isLikedByUser,
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
      disabled={isPending || isFetching}
    >
      <Heart
        className={cn('size-5', {
          'fill-red-500 text-red-500': data.isLikedByUser,
        })}
      />
      <span className="text-sm font-medium tabular-nums">
        {data.likes} <span className="hidden sm:inline">likes</span>
      </span>
    </button>
  );
}
