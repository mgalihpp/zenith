import PrismaQueryHelper from '@/helpers/prismaQuery';
import { db } from '@/lib/prisma';
import { sendResponse } from '@/lib/utils';
import { getSession } from '@/services/session.service';
import { PostsPage } from '@/types/post';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q') || '';
    const CURSOR = req.nextUrl.searchParams.get('cursor') || undefined;

    const PAGE_SIZE = 10;

    const searchQuery = q.split(' ').join(' & ');

    const { user } = await getSession();

    if (!user) {
      return sendResponse({
        message: 'Unauthorized',
        statusCode: 401,
      });
    }

    const posts = await db.post.findMany({
      where: {
        OR: [
          {
            content: {
              contains: searchQuery,
            },
          },
          {
            user: {
              displayName: {
                contains: searchQuery,
              },
            },
          },
          {
            user: {
              username: {
                contains: searchQuery,
              },
            },
          },
        ],
      },
      include: new PrismaQueryHelper().getPostsDataInclude(user.id),
      orderBy: {
        createdAt: 'desc',
      },
      take: PAGE_SIZE + 1,
      cursor: CURSOR ? { id: CURSOR } : undefined,
    });

    const NEXT_CURSOR = posts.length > PAGE_SIZE ? posts[PAGE_SIZE].id : null;

    const data: PostsPage = {
      posts: posts.slice(0, PAGE_SIZE),
      nextCursor: NEXT_CURSOR,
    };

    return sendResponse({ data });
  } catch (error) {
    console.error(error);
    return sendResponse({
      message: 'Something went wrong',
      statusCode: 500,
      status: false,
      httpCode: 500,
    });
  }
}
