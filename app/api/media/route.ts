import { db } from '@/lib/prisma';
import { sendResponse } from '@/lib/utils';
import { MediaType } from '@prisma/client';
import { NextRequest } from 'next/server';
import { z } from 'zod';

const fileSchema = z.array(
  z.object({
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
  })
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const parsedBody = fileSchema.parse(body);

    const mediaData = parsedBody.map((file) => ({
      url: file.url.replace(
        '/f/',
        `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
      ),
      type: file.type.startsWith('image') ? 'IMAGE' : ('VIDEO' as MediaType),
    }));

    const mediaIds = await db.$transaction(async (tx) => {
      const mediaIds = await Promise.all(
        mediaData.map(async (media) => {
          return await tx.media.create({
            data: {
              url: media.url,
              type: media.type,
            },
          });
        })
      );
      return mediaIds;
    });

    return sendResponse({
      data: mediaIds,
      status: true,
      statusCode: 200,
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
