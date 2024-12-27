import { Attachment } from '@/hooks/useMediaUpload';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import Image from 'next/image';

type AttachmentPreviewsProps = {
  attachments: Attachment[];
  removeAttachment: (fileName: string) => void;
};

type AttachmentPreviewProps = {
  attachment: Attachment;
  onRemoveClick: () => void;
};

export default function AttachmentPreviews(props: AttachmentPreviewsProps) {
  return (
    <div
      className={cn('flex flex-col gap-3', {
        'sm:grid sm:grid-cols-2': props.attachments.length > 1,
      })}
    >
      {props.attachments.map((attachment) => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => props.removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  );
}

function AttachmentPreview(props: AttachmentPreviewProps) {
  const src = URL.createObjectURL(props.attachment.file);

  return (
    <div
      className={cn('relative mx-auto size-fit', {
        'opacity-50': props.attachment.isUploading,
      })}
    >
      {props.attachment.file.type.startsWith('image') ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : props.attachment.file.type.startsWith('video') ? (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={props.attachment.file.type} />
        </video>
      ) : (
        <audio controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={props.attachment.file.type} />
        </audio>
      )}
      {!props.attachment.isUploading && (
        <button
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
          onClick={props.onRemoveClick}
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
