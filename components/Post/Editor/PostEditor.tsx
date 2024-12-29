'use client';

import { useSession } from '@/hooks/useSession';
import { useSubmitPostMutation } from './mutation';
import { useMediaUpload } from '@/hooks/useMediaUpload';
import UserAvatar from '@/components/User/UserAvatar';
import { useDropzone } from '@uploadthing/react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { cn } from '@/lib/utils';
import { ClipboardEvent } from 'react';
import AttachmentPreviews from './AttachmentPreviews';
import { Loader2 } from 'lucide-react';
import AddAttachmentButton from '@/components/AddAttachmentButton';
import LoadingButton from '@/components/LoadingButton';
import './styles.css';

export default function PostEditor() {
  const user = useSession();

  const mutation = useSubmitPostMutation();

  const {
    attachments,
    isUploading,
    removeAttachment,
    reset,
    startUpload,
    uploadProgress,
  } = useMediaUpload();

  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { onClick, ...rootProps } = getRootProps();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "What's crack-a-lackin'?",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: '\n',
    }) || '';

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
        userId: user?.id as string,
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          reset();
        },
      }
    );
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === 'file')
      .map((item) => item.getAsFile()) as File[];

    startUpload(files);
  }

  return (
    <div className="hidden sm:flex sm:flex-col gap-2 rounded-2xl bg-card px-3 shadow-sm border">
      <div className="flex gap-2 w-full pt-2">
        <UserAvatar avatarUrl={user?.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              'max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3',
              {
                'outline-dashed': isDragActive,
              }
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
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
        <AddAttachmentButton
          disabled={isUploading || attachments.length >= 5}
          onFilesSelected={startUpload}
        />
        <LoadingButton
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20 rounded-full font-bold"
          onClick={onSubmit}
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
}
