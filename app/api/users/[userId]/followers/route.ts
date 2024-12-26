import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';
import { FollowerInfo } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await getSession();

    if (!loggedInUser) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const user = await new UserService().getUserFollowersCount(
      params.userId,
      loggedInUser.id
    );

    if (!user) {
      return sendResponse({
        message: 'User not found',
        statusCode: 404,
      });
    }

    const data: FollowerInfo = {
      followers: user._count.followers,
      isFollowedByUser: !!user.followers.length,
    };

    return sendResponse({
      data,
      message: 'Followers fetched successfully',
    });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal server error',
      statusCode: 500,
      httpCode: 500,
    });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { user: loggedInUser } = await getSession();

    if (!loggedInUser) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    await new UserService().followUserAndSendNotification(
      loggedInUser.id,
      params.userId
    );

    return sendResponse({
      statusCode: 200,
    });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal server error',
      statusCode: 500,
      httpCode: 500,
    });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { user: loggedInUser } = await getSession();
    const { userId } = await params;

    if (!loggedInUser) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    await new UserService().unfollowUserAndCancelNotification(
      loggedInUser.id,
      userId
    );

    return sendResponse({ statusCode: 200 });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal server error',
      statusCode: 500,
      httpCode: 500,
    });
  }
}
