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

export type PostIdParams = Promise<{
  postId: string;
}>;

export type CreatePostParams = {
  content: string;
  userId: string;
  mediaIds?: string[];
};

export type CreateCommentParams = {
  post: PostData;
  content: string;
};

export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export type NotificationData = Prisma.NotificationGetPayload<{
  include: ReturnType<
    typeof PrismaQueryHelper.prototype.getNotificationsInclude
  >;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}
