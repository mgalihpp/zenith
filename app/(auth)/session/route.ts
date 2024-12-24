import { db } from '@/lib/prisma';
import SessionService from '@/lib/session';
import { sendResponse } from '@/lib/utils';
import { JWTPayload } from 'jose';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const session = new SessionService();

  const cookies = req.cookies;
  const sessionCookie = cookies.get('session')?.value;

  if (!sessionCookie) {
    return sendResponse({
      message: 'Unauthorized',
      statusCode: 401,
    });
  }

  const payloadData = (await session.decrypt(sessionCookie)) as JWTPayload & {
    userId: string;
  };

  if (!payloadData) {
    return sendResponse({
      message: 'Unauthorized',
      statusCode: 401,
    });
  }

  const user = await db.user.findFirst({
    where: {
      id: payloadData.userId,
    },
    omit: {
      passwordHash: true,
    },
  });

  if (!user) {
    return sendResponse({
      message: 'User not found',
      statusCode: 401,
    });
  }

  return sendResponse({
    data: user,
  });
}
