'use client';

import { useToast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { LikeInfo } from '@/types/post';
import {
  QueryKey,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

type LikeButtonProps = {
  postId: string;
  initialState: LikeInfo;
};

export default function LikeButton(props: LikeButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();

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
    <Button
      className="flex items-center gap-2 relative group text-muted-foreground"
      onClick={(e) => {
        e.stopPropagation();
        mutate();
      }}
      disabled={isPending || isFetching}
      variant="ghost"
      size="icon"
    >
      <Heart
        className={cn('size-5 group-hover:text-pink-500', {
          'fill-pink-500 text-pink-500': data.isLikedByUser,
        })}
      />
      <span
        className={cn(
          'absolute left-full top-1/2 transform -translate-y-1/2 text-xs font-medium tabular-nums group-hover:text-pink-500 transition-colors',
          {
            'text-pink-500': data.isLikedByUser,
          }
        )}
      >
        {data.likes}
      </span>
    </Button>
  );
}
