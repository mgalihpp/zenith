import { NotificationType } from '@prisma/client';
import Service from '.';

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
}

export default NotificationService;
