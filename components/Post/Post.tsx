import { useSession } from '@/hooks/useSession';
import { PostData } from '@/types/post';
import { useState } from 'react';
import UserTooltip from '@/components/User/UserTooltip';
import Link from 'next/link';
import { formatRelativeDate } from '@/lib/utils';
import UserAvatar from '@/components/User/UserAvatar';
import PostMoreButton from '@/components/Post/PostMoreButton';
import Linkify from '@/components/Linkify';
import MediaPreviews from '@/components/Post/MediaPreviews';
import LikeButton from '@/components/LikeButton';

type PostProps = { post: PostData };

export default function Post({ post }: PostProps) {
  const user = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div>
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>
            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressHydrationWarning
            >
              {formatRelativeDate(new Date(post.createdAt))}
            </Link>
          </div>
        </div>
        {post.user.id === user?.id && <PostMoreButton post={post} />}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}
      <hr className="text-muted-foreground" />
      <div className="flex justify-between gap-5">
        <div className="flex items-center gap-5">
          <LikeButton />
        </div>
      </div>
    </article>
  );
}