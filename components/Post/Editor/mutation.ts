import { useToast } from '@/hooks/use-toast';
import { useSession } from '@/hooks/useSession';
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { SubmitPost } from './action';
import { PostsPage } from '@/types/post';

export function useSubmitPostMutation() {
  const user = useSession();

  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: SubmitPost,
    onSuccess: async (data) => {
      const queryFilter = {
        queryKey: ['post-feed'],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        predicate(query: any) {
          return (
            query.queryKey.includes('for-you') ||
            (query.queryKey.includes('user-posts') &&
              query.queryKey.includes(user?.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.setQueriesData<
        InfiniteData<ApiRequestResponse<PostsPage>, string | null>
      >(queryFilter, (oldData) => {
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                data: {
                  posts: [data, ...firstPage.data.posts],
                  nextCursor: firstPage.data.nextCursor,
                },
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      await queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      toast({
        description: 'Post created',
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      });
    },
  });

  return mutation;
}
