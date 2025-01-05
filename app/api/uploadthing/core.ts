import streamServerClient from '@/lib/stream-chat';
import MediaService from '@/services/media.service';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError, UTApi } from 'uploadthing/server';

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const fileRouter = {
  avatar: f({
    image: { maxFileSize: '512KB' },
  })
    .middleware(async () => {
      const { user } = await getSession();

      if (!user) throw new UploadThingError('Unauthorized');

      return { user };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const oldAvatar = metadata.user.avatarUrl;

      if (oldAvatar) {
        const key = oldAvatar.split(
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        )[1];

        await new UTApi().deleteFiles(key);
      }

      const newAvatar = file.url.replace(
        '/f/',
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      );

      await Promise.all([
        new UserService().updateUserAvatar(metadata.user.id, newAvatar),
        streamServerClient.partialUpdateUser({
          id: metadata.user.id,
          set: {
            image: newAvatar,
          },
        }),
      ]);

      return {
        avatarUrl: newAvatar,
      };
    }),
  attachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 5 },
    video: { maxFileSize: '64MB', maxFileCount: 5 },
  })
    .middleware(async () => {
      const { user } = await getSession();

      if (!user) throw new UploadThingError('Unauthorized');

      return {};
    })
    .onUploadComplete(async ({ file }) => {
      const media = await new MediaService().createMedia(file);

      return { mediaId: media.id };
    }),
} satisfies FileRouter;

export type AppFileRouter = typeof fileRouter;
