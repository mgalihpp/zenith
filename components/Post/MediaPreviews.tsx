import { cn } from '@/lib/utils';
import { Media } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

type MediaPreviewsProps = {
  attachments: Media[];
};

export default function MediaPreviews(props: MediaPreviewsProps) {
  return (
    <div
      className={cn('flex flex-col gap-3', {
        'sm:grid sm:grid-cols-2': props.attachments.length > 1,
      })}
    >
      {props.attachments.map((media) => (
        <MediaPreview media={media} key={media.id} />
      ))}
    </div>
  );
}

type MediaPreviewProps = {
  media: Media;
};

const MediaPreview: React.FC<MediaPreviewProps> = (props) => {
  if (props.media.type === 'IMAGE') {
    return (
      <Image
        src={props.media.url}
        alt={props.media.type}
        width={500}
        height={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  if (props.media.type === 'VIDEO') {
    <div>
      <video
        src={props.media.url}
        controls
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    </div>;
  }

  if (props.media.type === 'AUDIO') {
    return (
      <audio
        src={props.media.url}
        controls
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }

  return <p className="text-destructive">Unsupported media type</p>;
};
