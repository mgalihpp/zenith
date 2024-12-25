import { getSession } from '@/services/session.service';
import { sendResponse } from '@/lib/utils';
import PostService from '@/services/post.service';
import { PostsPage } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const { user } = await getSession();

    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;
    const DEFAULT_POST_PAGESIZE = 10;

    const posts = await new PostService().getPosts(user, {
      orderBy: { createdAt: 'desc' },
      take: DEFAULT_POST_PAGESIZE + 1,
      cursor: CURSOR ? { id: CURSOR } : undefined,
    });

    const NEXT_CURSOR =
      posts.length > DEFAULT_POST_PAGESIZE
        ? posts[DEFAULT_POST_PAGESIZE].id
        : null;

    const data: PostsPage = {
      posts: posts.slice(0, DEFAULT_POST_PAGESIZE),
      nextCursor: NEXT_CURSOR,
    };

    return sendResponse({
      data,
      message: 'Posts fetched successfully',
      status: true,
    });
  } catch (error) {
    console.error('Failed to get posts ', error);
    return sendResponse({
      message: 'Failed to get posts',
      status: false,
      statusCode: 500,
      httpCode: 500,
    });
  }
}
