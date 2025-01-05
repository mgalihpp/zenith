import { sendResponse } from '@/lib/utils';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';
import { NotificationsPage } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;

    const PAGE_SIZE = 10;

    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const notifications = await new NotificationService().getNotifications(
      user.id,
      {
        orderBy: { createdAt: 'desc' },
        take: PAGE_SIZE + 1,
        cursor: CURSOR ? { id: CURSOR } : undefined,
      }
    );

    const NEXT_CURSOR =
      notifications.length > PAGE_SIZE ? notifications[PAGE_SIZE].id : null;

    const data: NotificationsPage = {
      notifications: notifications.slice(0, PAGE_SIZE),
      nextCursor: NEXT_CURSOR,
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
