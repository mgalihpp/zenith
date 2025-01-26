import streamServerClient from '@/lib/stream-chat';
import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';
import { NextRequest } from 'next/server';
import { UTApi } from 'uploadthing/server';
import { z } from 'zod';

const fileSchema = z.object({
  url: z.string().url(),
  type: z.string(),
  appUrl: z.string().url().optional(),
  customId: z.string().nullable().optional(),
  fileHash: z.string(),
  key: z.string(),
  lastModified: z.number(),
  name: z.string(),
  serverData: z
    .object({
      mediaId: z.string(),
    })
    .optional(),
  size: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const { user } = await getSession();
    const body = await req.json();

    const parsedBody = fileSchema.parse(body);

    if (!user)
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });

    const oldAvatar = user?.avatarUrl;

    if (oldAvatar) {
      const key = oldAvatar.split(
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      )[1];

      await new UTApi().deleteFiles(key);
    }

    const newAvatar = parsedBody.url.replace(
      '/f/',
      `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
    );

    await Promise.all([
      new UserService().updateUserAvatar(user.id, newAvatar),
      streamServerClient.partialUpdateUser({
        id: user.id,
        set: {
          image: newAvatar,
        },
      }),
    ]);

    return sendResponse({
      message: 'Avatar updated successfully',
      status: true,
      statusCode: 200,
      httpCode: 200,
    });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal server error',
      status: false,
      statusCode: 500,
      httpCode: 500,
    });
  }
}
