import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type BookmarkData = Prisma.BookmarkGetPayload<{
  include: {
    post: {
      include: ReturnType<
        typeof PrismaQueryHelper.prototype.getPostsDataInclude
      >;
    };
  };
}>;

export type BookmarkInfo = {
  isBookmarkedByUser: boolean;
};
