import { Prisma } from '@prisma/client';

class PrismaQueryHelper {
  getPostsDataInclude(loggedInUserId: string | undefined) {
    return {
      user: {
        select: this.getUserDataSelect(loggedInUserId),
      },
      attachments: true,
      likes: {
        where: {
          userId: loggedInUserId,
        },
        select: {
          userId: true,
        },
      },
      bookmarks: {
        where: {
          userId: loggedInUserId,
        },
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    } satisfies Prisma.PostInclude;
  }

  getUserDataSelect(loggedInUserId: string | undefined) {
    return {
      id: true,
      username: true,
      displayName: true,
      avatarUrl: true,
      bio: true,
      createdAt: true,
      updatedAt: true,
      followers: {
        where: {
          followerId: loggedInUserId,
        },
        select: {
          followerId: true,
        },
      },
      _count: {
        select: {
          posts: true,
          followers: true,
        },
      },
    } satisfies Prisma.UserSelect;
  }

  getDefaultUser() {
    return {
      omit: {
        passwordHash: true,
        googleId: true,
      },
    } satisfies Prisma.UserFindFirstArgs;
  }

  getCommentDataInclude(loggedInUserId: string) {
    return {
      user: {
        select: this.getUserDataSelect(loggedInUserId),
      },
    } satisfies Prisma.CommentInclude;
  }

  getNotificationsInclude() {
    return {
      issuer: {
        select: {
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
      post: {
        select: {
          content: true,
        },
      },
    } satisfies Prisma.NotificationInclude;
  }
}

export default PrismaQueryHelper;
