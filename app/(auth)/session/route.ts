import SessionService from '@/services/session.service';
import { sendResponse } from '@/lib/utils';
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

  const sessionData = await session.decrypt(sessionCookie);

  if (!sessionData) {
    return sendResponse({
      message: 'Unauthorized',
      statusCode: 401,
    });
  }

  const user = await session.getUser(sessionData.userId);

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
