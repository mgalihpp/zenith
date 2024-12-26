import { sendResponse } from '@/lib/utils';
import BookmarkService from '@/services/bookmark.service';
import { getSession } from '@/services/session.service';
import { PostsPage } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession();

    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;
    const DEFAULT_POST_PAGESIZE = 10;

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const bookmarks = await new BookmarkService().getBookmarks(user, {
      orderBy: {
        createdAt: 'desc',
      },
      take: DEFAULT_POST_PAGESIZE + 1,
      cursor: CURSOR ? { id: CURSOR } : undefined,
    });

    const NEXT_CURSOR =
      bookmarks.length > DEFAULT_POST_PAGESIZE
        ? bookmarks[DEFAULT_POST_PAGESIZE].id
        : null;

    const data: PostsPage = {
      posts: bookmarks
        .slice(0, DEFAULT_POST_PAGESIZE)
        .map((bookmark) => bookmark.post),
      nextCursor: NEXT_CURSOR,
    };

    return sendResponse({
      data,
      message: 'Posts fetched successfully',
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
