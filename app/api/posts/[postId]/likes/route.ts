import { sendResponse } from '@/lib/utils';
import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';
import { LikeInfo, PostIdParams } from '@/types/post';
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

    const post = await new PostService().getPostAndCheckIfUserLiked(
      user,
      postId
    );

    if (!post) {
      return sendResponse({
        message: 'Post not found',
        statusCode: 404,
      });
    }

    const data: LikeInfo = {
      likes: post._count.likes,
      isLikedByUser: !!post.likes.length,
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

    const post = await new PostService().getPost(postId);

    if (!post) {
      return sendResponse({
        message: 'Post not found',
        statusCode: 404,
      });
    }

    await new PostService().likePostAndSendNotification(user, post);

    return sendResponse({ statusCode: 200 });
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

    const post = await new PostService().getPost(postId);

    if (!post) {
      return sendResponse({
        message: 'Post not found',
        statusCode: 404,
      });
    }

    await new PostService().unlikePostAndCancelNotification(user, post);

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
