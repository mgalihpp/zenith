import { sendResponse } from '@/lib/utils';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';

export async function PATCH() {
  try {
    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    await new NotificationService().markAllAsRead(user.id);

    return sendResponse({
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
