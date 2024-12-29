import { useSession } from '@/hooks/useSession';
import { CommentData } from '@/types/comment';
import UserTooltip from '@/components/User/UserTooltip';
import Link from 'next/link';
import UserAvatar from '@/components/User/UserAvatar';
import { formatRelativeDate } from '@/lib/utils';
import CommentMoreButton from './CommentMoreButton';

type CommentProps = {
  comment: CommentData;
};

export default function Comment(props: CommentProps) {
  const user = useSession();

  return (
    <div className="group/comment flex gap-3 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={props.comment.user}>
          <Link href={`/users/${props.comment.user.username}`}>
            <UserAvatar avatarUrl={props.comment.user.avatarUrl} />
          </Link>
        </UserTooltip>
      </span>
      <div>
        <div className="flex items-center gap-1 text-sm">
          <UserTooltip user={props.comment.user}>
            <Link
              href={`/users/${props.comment.user.username}`}
              className="font-medium hover:underline"
            >
              {props.comment.user.displayName}
            </Link>
          </UserTooltip>
          <span className="text-muted-foreground">
            {formatRelativeDate(new Date(props.comment.createdAt))}
          </span>
        </div>
        <div>{props.comment.content}</div>
      </div>
      {props.comment.user.id === user?.id && (
        <CommentMoreButton
          comment={props.comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
}
