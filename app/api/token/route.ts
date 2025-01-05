import streamServerClient from '@/lib/stream-chat';
import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';

export async function GET() {
  try {
    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const expTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const issueAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamServerClient.createToken(user.id, expTime, issueAt);

    return sendResponse({ data: token });
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
