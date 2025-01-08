'use client';

import AddAttachmentButton from '@/components/AddAttachmentButton';
import { useSubmitCommentMutation } from '@/components/Comment/mutation';
import Linkify from '@/components/Linkify';
import LoadingButton from '@/components/LoadingButton';
import AttachmentPreviews from '@/components/Post/Editor/AttachmentPreviews';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/User/UserAvatar';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/lib/utils';
import { PostData } from '@/types/post';
import { Smile, SendHorizontal, Loader2 } from 'lucide-react';

type SingleCommentInputProps = {
  isReplying: boolean;
  setIsReplying: React.Dispatch<React.SetStateAction<boolean>>;
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  post: PostData;
};

export default function SingleCommentInput({
  isReplying,
  setIsReplying,
  input,
  setInput,
  post,
}: SingleCommentInputProps) {
  const user = useSession();

  const ref = useClickOutside<HTMLDivElement>(() => {
    if (!input.trim()) setIsReplying(false);
  });

  const mutation = useSubmitCommentMutation();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  const onSubmitComment = () => {
    if (!input.trim()) return;

    mutation.mutate(
      {
        post: post,
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          setInput('');
          reset();
        },
      }
    );
  };

  return (
    <div ref={ref} className="border-t space-y-2">
      <div className={`flex ${isReplying ? 'items-center' : ''} gap-4 mt-4`}>
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
            // onBlur={() => {
            //   if (input.trim()) return;

            //     setIsReplying(false);
            // }}
          />
          <div>
            {!!attachments.length && (
              <AttachmentPreviews
                attachments={attachments}
                removeAttachment={removeAttachment}
              />
            )}
            <div className="flex items-center justify-end gap-3 pb-2">
              {isUploading && (
                <>
                  <span className="text-sm">{uploadProgress ?? 0}%</span>
                  <Loader2 className="size-5 animate-spin text-primary" />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div
        className={cn('flex items-center justify-between', {
          hidden: !isReplying && !input.trim(),
        })}
      >
        <div className="flex items-center gap-2">
          <AddAttachmentButton
            onFilesSelected={startUpload}
            disabled={isUploading || attachments.length >= 5}
          />
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
  );
}
