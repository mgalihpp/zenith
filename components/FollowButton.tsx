'use client';

import { FollowerInfo } from '@/types/post';
import { useToast } from '@/hooks/use-toast';
import { QueryKey, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFollowerInfo } from '@/hooks/useFollowerInfo';
import { api } from '@/lib/api';
import LoadingButton from '@/components/LoadingButton';

type FollowButtonProps = {
  userId: string;
  initialState: FollowerInfo;
};

export default function FollowButton(props: FollowButtonProps) {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const queryKey: QueryKey = ['follower-info', props.userId];

  const { data, refetch, isFetching } = useFollowerInfo(props);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      data.isFollowedByUser
        ? api.delete(`/api/users/${props.userId}/followers`)
        : api.post(`/api/users/${props.userId}/followers`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey });

      const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

      queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
        followers:
          (previousState?.followers || 0) +
          (previousState?.isFollowedByUser ? -1 : 1),
        isFollowedByUser: !previousState?.isFollowedByUser,
      }));

      return { previousState };
    },
    onSuccess: () => refetch(),
    onError: (error, _, ctx) => {
      queryClient.setQueryData(queryKey, ctx?.previousState);
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      });
    },
  });

  return (
    <LoadingButton
      loading={isPending || isFetching}
      variant={data.isFollowedByUser ? 'secondary' : 'default'}
      onClick={() => mutate()}
    >
      {data.isFollowedByUser ? 'Unfollow' : 'Follow'}
    </LoadingButton>
  );
}
