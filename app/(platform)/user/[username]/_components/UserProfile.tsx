import FollowerCount from '@/components/FollowerCount';
import UserAvatar from '@/components/User/UserAvatar';
import { formatNumber } from '@/lib/utils';
import { FollowerInfo, UserData } from '@/types/user';
import { formatDate } from 'date-fns';
import EditProfileButton from './EditProfileButton';
import FollowButton from '@/components/FollowButton';
import Linkify from '@/components/Linkify';

interface UserProfileProps {
  user: UserData;
  loggedInUserId: string;
}

export default function UserProfile(props: UserProfileProps) {
  const followerInfo: FollowerInfo = {
    followers: props.user._count.followers,
    isFollowedByUser: props.user.followers.some(
      ({ followerId }) => followerId === props.loggedInUserId
    ),
  };

  return (
    <div className="h-fit w-full space-y-5 rounded-2xl bg-card px-3 py-1.5 shadow-sm">
      <UserAvatar
        avatarUrl={props.user.avatarUrl}
        size={250}
        className="mx-auto size-full max-h-60 max-w-60 rounded-full"
      />
      <div className="flex flex-wrap gap-3 sm:flex-nowrap">
        <div className="me-auto space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{props.user.displayName}</h1>
            <p className="text-muted-foreground text-base">
              @{props.user.username}
            </p>
          </div>
          <div className="text-sm">
            Member since{' '}
            {formatDate(new Date(props.user.createdAt), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span>
              Posts:{' '}
              <span className="font-semibold">
                {formatNumber(props.user._count.posts)}
              </span>
            </span>
            <FollowerCount userId={props.user.id} initialState={followerInfo} />
          </div>
          <div>
            {props.user.bio && (
              <>
                <Linkify>
                  <p className="overflow-hidden whitespace-pre-line break-words text-sm">
                    {props.user.bio}
                  </p>
                </Linkify>
              </>
            )}
          </div>
        </div>
        {props.user.id === props.loggedInUserId ? (
          <EditProfileButton user={props.user} />
        ) : (
          <FollowButton userId={props.user.id} initialState={followerInfo} />
        )}
      </div>
    </div>
  );
}
