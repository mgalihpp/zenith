import PrismaQueryHelper from '@/helpers/prismaQuery';
import { Prisma } from '@prisma/client';

export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof PrismaQueryHelper.prototype.getUserDataSelect>;
}>;

export interface NotificationCountInfo {
  unreadCount: number;
}

export interface MessageCountInfo {
  unreadCount: number;
}

export interface FollowerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
