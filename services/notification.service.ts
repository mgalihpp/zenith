import { NotificationType, Prisma } from '@prisma/client';
import Service from '.';
import { NotificationData } from '@/types/post';

class NotificationService extends Service {
  constructor() {
    super();
  }

  async createNotification(
    issuerId: string,
    recipientId: string,
    type: NotificationType,
    postId?: string
  ) {
    await this.db.notification.create({
      data: {
        issuerId,
        recipientId,
        postId,
        type,
      },
    });
  }

  async deleteNotification(
    issuerId: string,
    recipientId: string,
    type: NotificationType
  ) {
    await this.db.notification.deleteMany({
      where: {
        issuerId,
        recipientId,
        type,
      },
    });
  }

  async getNotificationsCount(recipientId: string) {
    const notificationsCount = await this.db.notification.count({
      where: {
        recipientId,
        read: false,
      },
    });

    return notificationsCount;
  }

  async getNotifications(
    userId: string,
    opts?: Prisma.NotificationFindManyArgs
  ) {
    const notifications = await this.db.notification.findMany({
      where: {
        recipientId: userId,
      },
      include: this.prismaQueryHelper.getNotificationsInclude(),
      ...opts,
    });

    return notifications as NotificationData[];
  }

  async markAllAsRead(userId: string) {
    await this.db.notification.updateMany({
      where: {
        recipientId: userId,
        read: false,
      },
      data: {
        read: true,
      },
    });
  }
}

export default NotificationService;
