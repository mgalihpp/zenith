'use client';

import { useSession } from '@/hooks/useSession';
import { PostData } from '@/types/post';
import { useState } from 'react';
import UserTooltip from '@/components/User/UserTooltip';
import Link from 'next/link';
import { cn, formatRelativeDate } from '@/lib/utils';
import UserAvatar from '@/components/User/UserAvatar';
import PostMoreButton from '@/components/Post/PostMoreButton';
import Linkify from '@/components/Linkify';
import MediaPreviews from '@/components/Post/MediaPreviews';
import LikeButton from '@/components/LikeButton';
import CommentButton from '@/components/CommentButton';
import BookmarkButton from '@/components/BookmarkButton';
import { useRouter } from 'next/navigation';
import CommentInput from '@/components/Comment/CommentInput';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ImageIcon, SendHorizontal, Smile } from 'lucide-react';
import LoadingButton from '@/components/LoadingButton';
import Comments from '@/components/Comment/Comments';
import { useSubmitCommentMutation } from '@/components/Comment/mutation';

type PostProps = { post: PostData };

export default function SinglePost({ post }: PostProps) {
  const user = useSession();
  const router = useRouter();

  const [showComments, setShowComments] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const [input, setInput] = useState('');

  const navigateToPost = () => router.push(`/post/${post.id}`);

  const mutation = useSubmitCommentMutation();

  const onSubmitComment = () => {
    if (!input.trim()) return;

    mutation.mutate(
      {
        post: post,
        content: input,
      },
      {
        onSuccess: () => setInput(''),
      }
    );
  };

  return (
    <>
      <article
        className="group/post space-y-3 bg-card px-3 py-1.5 shadow-sm cursor-pointer"
        onClick={navigateToPost}
      >
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <UserTooltip user={post.user}>
              <Link
                href={`/user/${post.user.username}`}
                onClick={(e) => e.stopPropagation()}
              >
                <UserAvatar avatarUrl={post.user.avatarUrl} size={40} />
              </Link>
            </UserTooltip>
            <div className="flex flex-col flex-wrap gap-1">
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
                  className="block text-xs text-muted-foreground"
                  suppressHydrationWarning
                >
                  {formatRelativeDate(new Date(post.createdAt))}
                </p>
              </div>
            </div>
          </div>
          {post.user.id === user?.id && <PostMoreButton post={post} />}
        </div>
        <div className="flex flex-col gap-2 flex-1">
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

          <div className="border-t space-y-2">
            <div
              className={`flex ${isReplying ? 'items-center' : ''} gap-4 mt-4`}
            >
              <UserAvatar
                avatarUrl={user?.avatarUrl}
                size={36}
                className="relative"
              />
              <div className="flex flex-col gap-2 grow">
                <div
                  className={cn('flex gap-2 items-center', {
                    hidden: !isReplying,
                  })}
                >
                  <p className="text-sm text-muted-foreground">Reply</p>
                  <Linkify>{`@${post.user.username}`}</Linkify>
                </div>

                <Textarea
                  placeholder="Write a comment..."
                  className={cn(
                    'focus-visible:ring-0 min-h-10 focus-visible:ring-offset-0 outline-none border-none',
                    {
                      'max-h-80 min-h-20': isReplying,
                    }
                  )}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsReplying(true);
                  }}
                  onBlur={() => {
                    if (input.trim()) return;

                    setIsReplying(false);
                  }}
                />
              </div>
            </div>
            <div
              className={cn('flex items-center justify-between', {
                hidden: !isReplying && !input.trim(),
              })}
            >
              <div className="flex items-center gap-2">
                <Button type="button" variant="ghost" size="icon">
                  <ImageIcon size={20} />
                </Button>
                <Button type="button" variant="ghost" size="icon">
                  <Smile size={20} />
                </Button>
              </div>
              <div>
                <LoadingButton
                  type="button"
                  className="rounded-2xl font-bold"
                  loading={mutation.isPending}
                  disabled={!input.trim()}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSubmitComment();
                  }}
                >
                  Post
                  <SendHorizontal className="size-5" />
                </LoadingButton>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Comments post={post} />
    </>
  );
}
