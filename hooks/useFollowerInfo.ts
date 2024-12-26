import { api } from '@/lib/api';
import { FollowerInfo } from '@/types/post';
import { useQuery } from '@tanstack/react-query';

type Params = {
  userId: string;
  initialState: FollowerInfo;
};

export function useFollowerInfo(params: Params) {
  const query = useQuery({
    queryKey: ['follower-info', params.userId],
    queryFn: () =>
      api
        .get<FollowerInfo>(`/api/users/${params.userId}/followers`)
        .then((json) => json.data),
    initialData: params.initialState,
    staleTime: Infinity,
  });

  return query;
}
