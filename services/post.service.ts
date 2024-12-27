import { CreatePostParams, GetPostsParams, PostData } from '@/types/post';
import { Post, Prisma } from '@prisma/client';
import Service from '.';
import LikeService from './like.service';
import NotificationService from './notification.service';

class PostService extends Service {
  constructor() {
    super();
  }

  async createPost({ content, userId, mediaIds }: CreatePostParams) {
    const newPost = await this.db.post.create({
      data: {
        content,
        userId,
        attachments: {
          connect: mediaIds?.map((mediaId) => ({ id: mediaId })),
        },
      },
      include: this.prismaQueryHelper.getPostsDataInclude(userId),
    });

    return newPost;
  }

  async getPost(postId: string, opts?: Prisma.PostFindUniqueArgs) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      ...opts,
    });

    return post;
  }

  async getPosts(user?: { id?: string }, opts?: Prisma.PostFindManyArgs) {
    const posts = await this.db.post.findMany({
      include: this.prismaQueryHelper.getPostsDataInclude(user?.id),
      ...opts,
    });

    return posts as PostData[];
  }

  async getPostAndCheckIfUserLiked(user: GetPostsParams, postId: string) {
    const post = await this.db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        likes: {
          where: {
            userId: user?.id,
          },
        },
        _count: {
          select: {
            likes: true,
          },
        },
      },
    });

    return post;
  }

  async likePostAndSendNotification(user: GetPostsParams, post: Post) {
    const likeService = new LikeService(user.id, post.id);
    const notificationService = new NotificationService();

    await this.db.$transaction(async () => {
      await Promise.all([
        likeService.createLike(),
        notificationService.createNotification(user.id, post.userId, 'LIKE'),
      ]);
    });
  }

  async unlikePostAndCancelNotification(user: GetPostsParams, post: Post) {
    const likeService = new LikeService(user.id, post.id);
    const notificationService = new NotificationService();

    await this.db.$transaction(async () => {
      await Promise.all([
        likeService.deleteLike(),
        notificationService.deleteNotification(user.id, post.userId, 'LIKE'),
      ]);
    });
  }
}

export default PostService;
