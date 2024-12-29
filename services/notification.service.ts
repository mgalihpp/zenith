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
    this.db.notification.create({
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
}

export default NotificationService;
