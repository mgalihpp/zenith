import { sendResponse } from '@/lib/utils';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';
import { NotificationCountInfo } from '@/types/user';

export async function GET() {
  try {
    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const unreadCount = await new NotificationService().getNotificationsCount(
      user.id
    );

    const data: NotificationCountInfo = {
      unreadCount,
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
