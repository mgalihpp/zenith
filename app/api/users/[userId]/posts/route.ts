import { sendResponse } from '@/lib/utils';
import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';
import { PostsPage } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;
    const DEFAULT_POST_PAGESIZE = 10;

    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const posts = await new PostService().getPosts(
      { id: userId },
      {
        where: {
          userId,
        },
        orderBy: { createdAt: 'desc' },
        take: DEFAULT_POST_PAGESIZE + 1,
        cursor: CURSOR ? { id: CURSOR } : undefined,
      }
    );

    const NEXT_CURSOR =
      posts.length > DEFAULT_POST_PAGESIZE
        ? posts[DEFAULT_POST_PAGESIZE].id
        : null;

    const data: PostsPage = {
      posts: posts.slice(0, DEFAULT_POST_PAGESIZE),
      nextCursor: NEXT_CURSOR,
    };

    return sendResponse({ data });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Internal Server Error',
      status: false,
      statusCode: 500,
      httpCode: 500,
    });
  }
}
