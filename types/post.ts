import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type GetPostsParams =
  | {
      id?: string;
    }
  | undefined;

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof PrismaQueryHelper.prototype.getPostsDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}
