import { Prisma, User } from '@prisma/client';
import Service from '.';
import FollowService from './follow.service';
import NotificationService from './notification.service';
import { UpdateUserProfileValues } from '@/lib/validation';
import { UserData } from '@/types/user';

class UserService extends Service {
  constructor() {
    super();
  }

  async updateUserAvatar(userId: string, avatarUrl: string): Promise<void> {
    await this.db.user.update({
      where: { id: userId },
      data: { avatarUrl },
    });
  }

  async updateUser(
    userId: string,
    data: UpdateUserProfileValues
  ): Promise<UserData> {
    const updatedUser = await this.db.user.update({
      where: { id: userId },
      data,
      select: this.prismaQueryHelper.getUserDataSelect(userId),
    });

    return updatedUser as unknown as UserData;
  }

  async getUsersByUsername(
    username: User['username'],
    opts?: Prisma.UserFindManyArgs
  ) {
    const user = await this.db.user.findFirst({
      where: { username: { equals: username } },
      ...opts,
    });

    return user;
  }

  async getUserFollowersCount(userId: User['id'], followerId: User['id']) {
    const user = await this.db.user.findUnique({
      where: { id: userId },
      select: {
        followers: { where: { followerId }, select: { followerId: true } },
        _count: { select: { followers: true } },
      },
    });

    return user;
  }

  async followUserAndSendNotification(
    followerId: User['id'],
    followingId: User['id']
  ): Promise<void> {
    await this.handleFollowAndNotification(followerId, followingId, true);
  }

  async unfollowUserAndCancelNotification(
    followerId: User['id'],
    followingId: User['id']
  ): Promise<void> {
    await this.handleFollowAndNotification(followerId, followingId, false);
  }

  private async handleFollowAndNotification(
    followerId: User['id'],
    followingId: User['id'],
    isFollow: boolean
  ): Promise<void> {
    const followService = new FollowService(followerId, followingId);
    const notificationService = new NotificationService();
    const followAction = isFollow
      ? followService.createFollow()
      : followService.deleteFollow();
    const notificationAction = isFollow
      ? notificationService.createNotification(
          followerId,
          followingId,
          'FOLLOW'
        )
      : notificationService.deleteNotification(
          followerId,
          followingId,
          'FOLLOW'
        );

    try {
      await this.db.$transaction(async () => {
        await Promise.all([followAction, notificationAction]);
      });
    } catch (error) {
      console.error('Transaction failed: ', error);
      throw error;
    }
  }
}

export default UserService;
