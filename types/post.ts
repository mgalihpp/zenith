import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type GetPostsParams = { id: string };

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof PrismaQueryHelper.prototype.getPostsDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export type FollowerInfo = {
  followers: number;
  isFollowedByUser: boolean;
};

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export type PostIdParams = {
  postId: string;
};
