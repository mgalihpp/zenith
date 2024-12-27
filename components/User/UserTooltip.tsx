'use client';

import { useSession } from '@/hooks/useSession';
import { FollowerInfo } from '@/types/post';
import { UserData } from '@/types/user';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Link from 'next/link';
import UserAvatar from '@/components/User/UserAvatar';
import FollowButton from '@/components/FollowButton';
import Linkify from '@/components/Linkify';
import FollowerCount from '@/components/FollowerCount';

type UserTooltipProps = {
  children: React.ReactNode;
  user: UserData;
};

export default function UserTooltip(props: UserTooltipProps) {
  const loggedInUser = useSession();

  const followerState: FollowerInfo = {
    followers: props.user._count.followers,
    isFollowedByUser: !!props.user.followers.some(
      ({ followerId }) => followerId === loggedInUser?.id
    ),
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{props.children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words px-1 py-2.5 md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${props.user.username}`}>
                <UserAvatar avatarUrl={props.user.avatarUrl} size={70} />
              </Link>
              {loggedInUser?.id !== props.user.id && (
                <FollowButton
                  userId={props.user.id}
                  initialState={followerState}
                />
              )}
            </div>
            <div>
              <Link href={`/users/${props.user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {props.user.displayName}
                </div>
                <div className="text-muted-foreground">
                  @{props.user.username}
                </div>
              </Link>
            </div>
            {props.user.bio && (
              <Linkify>
                <div className="line-clamp-4 whitespace-pre-line">
                  {props.user.bio}
                </div>
              </Linkify>
            )}
            <FollowerCount
              userId={props.user.id}
              initialState={followerState}
            />
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
