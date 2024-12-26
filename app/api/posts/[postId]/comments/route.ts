import { sendResponse } from '@/lib/utils';
import CommentService from '@/services/comment.service';
import { getSession } from '@/services/session.service';
import { CommentPage } from '@/types/comment';
import { PostIdParams } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(
  req: NextRequest,
  { params }: { params: PostIdParams }
) {
  try {
    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;

    const DEFAULT_COMMENT_PAGESIZE = 5;

    const { postId } = await params;

    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const comments = await new CommentService().getComments(user, postId, {
      orderBy: {
        createdAt: 'asc',
      },
      take: DEFAULT_COMMENT_PAGESIZE + 1,
      cursor: CURSOR ? { id: CURSOR } : undefined,
    });

    const PREVIOUS_CURSOR =
      comments.length > DEFAULT_COMMENT_PAGESIZE
        ? comments[DEFAULT_COMMENT_PAGESIZE].id
        : null;

    const data: CommentPage = {
      comments:
        comments.length > DEFAULT_COMMENT_PAGESIZE
          ? comments.slice(1)
          : comments,
      previousCursor: PREVIOUS_CURSOR,
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
