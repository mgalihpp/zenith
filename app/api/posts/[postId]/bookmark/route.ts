import { sendResponse } from '@/lib/utils';
import BookmarkService from '@/services/bookmark.service';
import { getSession } from '@/services/session.service';
import { BookmarkInfo } from '@/types/bookmark';
import { PostIdParams } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: PostIdParams }
) {
  try {
    const { user } = await getSession();

    const { postId } = await params;

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const bookmark = await new BookmarkService().checkIfUserBookmarkedPost(
      user,
      postId
    );

    const data: BookmarkInfo = {
      isBookmarkedByUser: !!bookmark,
    };

    return sendResponse({
      data,
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

export async function POST(
  req: NextRequest,
  { params }: { params: PostIdParams }
) {
  try {
    const { user } = await getSession();

    const { postId } = await params;

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    await new BookmarkService().createBookmark(user, postId);

    return sendResponse({
      statusCode: 201,
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: PostIdParams }
) {
  try {
    const { user } = await getSession();

    const { postId } = await params;

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    await new BookmarkService().deleteBookmark(user, postId);

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
