import { useToast } from '@/hooks/use-toast';
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import DeletePost from './action';
import { PostsPage } from '@/types/post';

export function useDeletePostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const router = useRouter();
  const pathname = usePathname();

  const mutation = useMutation({
    mutationFn: DeletePost,
    onSuccess: async (deletedPost) => {
      const queryFilter = {
        queryKey: ['post-feed'],
        predicate: (query) => query.queryKey.includes('post-feed'),
      } as QueryFilters<
        InfiniteData<ApiRequestResponse<PostsPage>, string | null>,
        Error,
        InfiniteData<ApiRequestResponse<PostsPage>, string | null>,
        QueryKey
      >;

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
                  posts: firstPage.data.posts.filter(
                    (post) => post.id !== deletedPost.id
                  ),
                  nextCursor: firstPage.data.nextCursor,
                },
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      toast({
        description: 'Post deleted successfully.',
      });

      if (pathname === `/post/${deletedPost.id}`) {
        router.push(`/user/${deletedPost.user.username}`);
      }
    },
    onError(error) {
      console.error(error);
      toast({
        variant: 'destructive',
        description: 'Something went wrong. Please try again.',
      });
    },
  });

  return mutation;
}
