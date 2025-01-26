import { useState } from 'react';
import { useToast } from './use-toast';
import { useUploadThing } from '@/lib/uploadthing';
import { api } from '@/lib/api';
import { Media } from '@prisma/client';

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}

export function useMediaUpload() {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const { startUpload, isUploading } = useUploadThing('attachment', {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split('.').pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          {
            type: file.type,
          }
        );
      });
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((f) => ({ file: f, isUploading: true })),
      ]);
      return renamedFiles;
    },
    onUploadProgress: setUploadProgress,
    async onClientUploadComplete(res) {
      const result = await api
        .post<Media[]>('/api/media', {
          json: res.map((r) => r),
        })
        .then((json) => json.data);

      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);

          if (!uploadResult) return a;

          return {
            ...a,
            mediaId: result.map((m) => m.id)[0],
            isUploading: false,
          };
        })
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        variant: 'destructive',
        description: e.message,
      });
    },
  });

  function handleStartUpload(files: File[]) {
    if (isUploading) {
      toast({
        variant: 'destructive',
        description: 'Please wait for the current upload to finish.',
      });
      return;
    }

    if (attachments.length + files.length > 5) {
      toast({
        variant: 'destructive',
        description: 'You can only upload up to 5 attachments per post.',
      });
      return;
    }

    startUpload(files);
  }

  function removeAttachment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadProgress(0);
  }

  return {
    startUpload: handleStartUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset,
  };
}
