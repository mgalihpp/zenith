import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof PrismaQueryHelper.prototype.getCommentDataInclude>;
}>;

export type CommentPage = {
  comments: CommentData[];
  previousCursor: string | null;
};
