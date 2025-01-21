'use client';

import { Loader2, SendHorizontal, Smile } from 'lucide-react';
import { useSubmitCommentMutation } from './mutation';
import React, { useState } from 'react';
import { PostData } from '@/types/post';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatRelativeDate } from '@/lib/utils';
import Linkify from '@/components/Linkify';
import UserAvatar from '@/components/User/UserAvatar';
import { useSession } from '@/hooks/useSession';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import LoadingButton from '@/components/LoadingButton';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import AddAttachmentButton from '@/components/AddAttachmentButton';
import AttachmentPreviews from '@/components/Post/Editor/AttachmentPreviews';

type CommentInputProps = {
  post: PostData;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CommentInput(props: CommentInputProps) {
  const user = useSession();

  const [input, setInput] = useState('');

  const mutation = useSubmitCommentMutation();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  async function onSubmit() {
    if (!input.trim()) return;

    mutation.mutate(
      {
        post: props.post,
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          setInput('');
          props.setOpen(false);
          reset();
        },
      }
    );
  }

  return (
    <Dialog open={props.open} onOpenChange={props.setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <div className="w-full min-w-0 space-y-5">
            <div className="flex gap-3">
              <div className="relative">
                <hr className="h-full w-0.5 bg-muted-foreground absolute top-0 left-1/2" />
                <UserAvatar
                  avatarUrl={props.post.user.avatarUrl}
                  size={36}
                  className="relative"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex max-sm:flex-col flex-wrap sm:items-center gap-1">
                    <p className="block font-medium hover:underline">
                      {props.post.user.displayName}
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="block text-xs text-muted-foreground">
                        @{props.post.user.username}
                      </p>
                      <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground inline-block" />
                      <p
                        className="block text-xs text-muted-foreground"
                        suppressHydrationWarning
                      >
                        {formatRelativeDate(new Date(props.post.createdAt))}
                      </p>
                    </div>
                  </div>
                </div>
                <Linkify>
                  <div className="whitespace-pre-line break-words text-sm">
                    {props.post.content}
                  </div>
                </Linkify>

                <div className="flex gap-2 items-center">
                  <p className="text-sm text-muted-foreground">Reply</p>
                  <Linkify>{`@${props.post.user.username}`}</Linkify>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5">
              <div className="flex gap-5">
                <div>
                  <UserAvatar avatarUrl={user?.avatarUrl} size={36} />
                </div>
                <div className="grow">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full max-h-80 focus-visible:ring-0 min-h-10 focus-visible:ring-offset-0 outline-none border-none"
                    autoFocus
                  />
                </div>
              </div>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AddAttachmentButton
                    disabled={isUploading || attachments.length >= 5}
                    onFilesSelected={startUpload}
                  />
                  <Button type="button" variant="ghost" size="icon">
                    <Smile size={20} />
                  </Button>
                </div>
                <div>
                  <LoadingButton
                    type="button"
                    className="rounded-full font-bold"
                    loading={mutation.isPending}
                    disabled={!input.trim() || isUploading}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSubmit();
                    }}
                  >
                    Post
                    <SendHorizontal className="size-5" />
                  </LoadingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
