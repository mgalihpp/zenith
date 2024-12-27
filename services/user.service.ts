import { Prisma, User } from '@prisma/client';
import Service from '.';
import FollowService from './follow.service';
import NotificationService from './notification.service';

class UserService extends Service {
  constructor() {
    super();
  }

  async updateUserAvatar(userId: string, avatarUrl: string) {
    await this.db.user.update({
      where: {
        id: userId,
      },
      data: {
        avatarUrl,
      },
    });
  }

  async getUsersByUsername(
    username: User['username'],
    opts?: Prisma.UserFindManyArgs
  ) {
    const user = await this.db.user.findFirst({
      where: {
        username: {
          equals: username,
        },
      },
      ...opts,
    });

    return user;
  }

  async getUserFollowersCount(userId: User['id'], followerId: User['id']) {
    const user = await this.db.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followers: {
          where: {
            followerId,
          },
          select: {
            followerId: true,
          },
        },
        _count: {
          select: {
            followers: true,
          },
        },
      },
    });

    return user;
  }

  async followUserAndSendNotification(
    followerId: User['id'],
    followingId: User['id']
  ) {
    const followService = new FollowService(followerId, followingId);
    const noficationService = new NotificationService();

    await this.db.$transaction(async () => {
      await Promise.all([
        followService.createFollow(),
        noficationService.createNotification(followerId, followingId, 'FOLLOW'),
      ]);
    });
  }

  async unfollowUserAndCancelNotification(
    followerId: User['id'],
    followingId: User['id']
  ) {
    const followService = new FollowService(followerId, followingId);
    const noficationService = new NotificationService();

    await this.db.$transaction(async () => {
      await Promise.all([
        followService.deleteFollow(),
        noficationService.deleteNotification(followerId, followingId, 'FOLLOW'),
      ]);
    });
  }
}
export default UserService;
