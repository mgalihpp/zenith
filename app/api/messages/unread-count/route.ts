import streamServerClient from '@/lib/stream-chat';
import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';
import { MessageCountInfo } from '@/types/user';

export async function GET() {
  try {
    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id
    );

    const data: MessageCountInfo = {
      unreadCount: total_unread_count,
    };

    return sendResponse({ data });
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
