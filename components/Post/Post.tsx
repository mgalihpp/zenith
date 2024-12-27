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
import CommentButton from '@/components/CommentButton';
import BookmarkButton from '@/components/BookmarkButton';

type PostProps = { post: PostData };

export default function Post({ post }: PostProps) {
  const user = useSession();

  const [showComments, setShowComments] = useState(false);

  return (
    <article className="group/post space-y-3 rounded-t-2xl bg-card p-3 sm:p-5 shadow-sm border-b">
      {/* <div className="flex justify-between gap-3"> */}
      <div className="flex flex-wrap gap-3">
        <div>
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar
                avatarUrl={post.user.avatarUrl}
                className="max-sm:size-10"
              />
            </Link>
          </UserTooltip>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex max-sm:flex-col sm:items-center gap-1">
              <UserTooltip user={post.user}>
                <Link
                  href={`/users/${post.user.username}`}
                  className="block font-medium hover:underline"
                >
                  {post.user.displayName}
                </Link>
              </UserTooltip>
              <div className="flex items-center gap-1">
                <p className="block text-xs text-muted-foreground">
                  @{post.user.username}
                </p>
                <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground inline-block" />
                <p
                  // href={`/posts/${post.id}`}
                  className="block text-xs text-muted-foreground"
                  suppressHydrationWarning
                >
                  {formatRelativeDate(new Date(post.createdAt))}
                </p>
              </div>
            </div>
            {post.user.id === user?.id && <PostMoreButton post={post} />}
          </div>
          <Linkify>
            <div className="whitespace-pre-line break-words text-sm">
              {post.content}
            </div>
          </Linkify>
          {!!post.attachments.length && (
            <MediaPreviews attachments={post.attachments} />
          )}
          <div className="flex justify-between gap-5">
            <div className="flex items-center gap-5">
              <LikeButton
                postId={post.id}
                initialState={{
                  likes: post._count.likes,
                  isLikedByUser: post.likes.some(
                    ({ userId }) => userId === user?.id
                  ),
                }}
              />
              <CommentButton
                post={post}
                onClick={() => setShowComments(true)}
              />
            </div>
            <BookmarkButton
              postId={post.id}
              initialState={{
                isBookmarkedByUser: post.bookmarks.some(
                  ({ userId }) => userId === user?.id
                ),
              }}
            />
          </div>
        </div>
      </div>
      {/* </div> */}

      {/* TODO: SHOW COMMENTS */}
    </article>
  );
}
