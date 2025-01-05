import { BookmarkData } from '@/types/bookmark';
import Service from '.';
import { Prisma } from '@prisma/client';
import { GetPostsParams } from '@/types/post';

class BookmarkService extends Service {
  constructor() {
    super();
  }

  async getBookmarks(user: GetPostsParams, opts?: Prisma.BookmarkFindManyArgs) {
    const bookmarks = await this.db.bookmark.findMany({
      where: {
        userId: user.id,
      },
      include: {
        post: {
          include: this.prismaQueryHelper.getPostsDataInclude(user?.id),
        },
      },
      ...opts,
    });

    return bookmarks as BookmarkData[];
  }

  async checkIfUserBookmarkedPost(user: GetPostsParams, postId: string) {
    const bookmark = await this.db.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    return bookmark;
  }

  async createBookmark(user: GetPostsParams, postId: string) {
    await this.db.bookmark.upsert({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
      create: {
        userId: user.id,
        postId,
      },
      update: {},
    });
  }

  async deleteBookmark(user: GetPostsParams, postId: string) {
    await this.db.bookmark.deleteMany({
      where: {
        userId: user.id,
        postId,
      },
    });
  }
}

export default BookmarkService;
