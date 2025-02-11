import PrismaQueryHelper from '@/helpers/prismaQuery';
import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { user: loggedInUser } = await getSession();

    const { username } = await params;

    if (!loggedInUser) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const user = await new UserService().getUsersByUsername(username, {
      select: new PrismaQueryHelper().getUserDataSelect(loggedInUser.id),
    });

    if (!user) {
      return sendResponse({
        message: 'User not found',
        statusCode: 404,
      });
    }

    return sendResponse({
      data: user,
      message: 'User found successfully',
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
