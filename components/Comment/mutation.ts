import { useToast } from '@/hooks/use-toast';
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { DeleteComment, SubmitComment } from './action';
import { CommentPage } from '@/types/comment';

export function useSubmitCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: SubmitComment,
    onSuccess: async (data) => {
      const queryKey: QueryKey = ['comments', data.postId];

      await queryClient.cancelQueries({
        queryKey,
      });

      queryClient.setQueryData<
        InfiniteData<ApiRequestResponse<CommentPage>, string | null>
      >(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                data: {
                  previousCursor: firstPage.data.previousCursor,
                  comments: [...firstPage.data.comments, data],
                },
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });

      toast({
        description: 'Comment created',
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

export function useDeleteCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: DeleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ['comments', deletedComment.postId];

      await queryClient.cancelQueries({
        queryKey,
      });

      queryClient.setQueryData<
        InfiniteData<ApiRequestResponse<CommentPage>, string | null>
      >(queryKey, (oldData) => {
        const firstPage = oldData?.pages[0];

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                data: {
                  previousCursor: firstPage.data.previousCursor,
                  comments: firstPage.data.comments.filter(
                    (comment) => comment.id !== deletedComment.id
                  ),
                },
              },
              ...oldData.pages.slice(1),
            ],
          };
        }
      });

      toast({
        description: 'Comment deleted',
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
