import { useToast } from '@/hooks/use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { UpdateUserProfileValues } from '@/lib/validation';
import {
  InfiniteData,
  QueryFilters,
  QueryKey,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { UpdateUser } from './action';
import { PostsPage } from '@/types/post';

type Payload = {
  avatar?: File;
  data: UpdateUserProfileValues;
};

export function useUpdateUserProfileMutation() {
  const { toast } = useToast();

  const router = useRouter();

  const queryClient = useQueryClient();

  const { startUpload: startProfileImageUpload } = useUploadThing('avatar');

  const mutation = useMutation({
    mutationFn: async (data: Payload) => {
      return await Promise.all([
        UpdateUser(data.data),
        data.avatar && startProfileImageUpload([data.avatar]),
      ]);
    },
    onSuccess: async ([updateUser, uploadResult]) => {
      const newAvatarUrl = uploadResult?.[0].serverData.avatarUrl;

      const queryFilter = {
        queryKey: ['post-feed'],
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

        console.log(oldData);
        console.log(firstPage);

        if (firstPage) {
          return {
            pageParams: oldData.pageParams,
            pages: [
              {
                data: {
                  nextCursor: firstPage.data.nextCursor,
                  posts: firstPage.data.posts.map((post) => {
                    if (post.user.id === updateUser.id) {
                      return {
                        ...post,
                        user: {
                          ...updateUser,
                          avatarUrl: newAvatarUrl || updateUser.avatarUrl,
                        },
                      };
                    }
                    return post;
                  }),
                },
              },
            ],
          };
        }
      });

      router.refresh();

      toast({
        description: 'Profile updated',
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
