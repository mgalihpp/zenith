'use client';

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
import { useRouter } from 'next/navigation';
import CommentInput from '@/components/Comment/CommentInput';

type PostProps = { post: PostData };

export default function Post({ post }: PostProps) {
  const user = useSession();
  const router = useRouter();

  const [showComments, setShowComments] = useState(false);

  const navigateToPost = () => router.push(`/post/${post.id}`);

  return (
    <article
      className="group/post space-y-3 bg-card px-3 py-1.5 shadow-sm cursor-pointer"
      onClick={navigateToPost}
    >
      <div className="flex gap-3">
        <div>
          <UserTooltip user={post.user}>
            <Link
              href={`/user/${post.user.username}`}
              onClick={(e) => e.stopPropagation()}
            >
              <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
            </Link>
          </UserTooltip>
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center justify-between">
            <div className="flex max-sm:flex-col flex-wrap sm:items-center gap-1">
              <UserTooltip user={post.user}>
                <Link
                  href={`/user/${post.user.username}`}
                  className="block font-medium hover:underline"
                  onClick={(e) => e.stopPropagation()}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setShowComments(!showComments);
                }}
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
          <CommentInput
            post={post}
            open={showComments}
            setOpen={setShowComments}
          />
        </div>
      </div>
    </article>
  );
}
