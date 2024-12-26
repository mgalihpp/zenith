'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import UserTooltip from '@/components/User/UserTooltip';
import { api } from '@/lib/api';
import { UserData } from '@/types/user';
import { HTTPError } from 'ky';

interface UserLinkWithTooltipProps extends PropsWithChildren {
  username: string;
}

export default function UserLinkWithTooltip({
  children,
  username,
}: UserLinkWithTooltipProps) {
  const { data } = useQuery({
    queryKey: ['user-data', username],
    queryFn: () =>
      api
        .get<UserData>(`/api/users/username/${username}`)
        .then((json) => json.data),
    retry(failureCount, error) {
      if (error instanceof HTTPError && error.response.status === 404) {
        return false;
      }
      return failureCount < 3;
    },
    staleTime: Infinity,
  });

  if (!data) {
    return (
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    );
  }

  return (
    <UserTooltip user={data}>
      <Link
        href={`/users/${username}`}
        className="text-primary hover:underline"
      >
        {children}
      </Link>
    </UserTooltip>
  );
}
