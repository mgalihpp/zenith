import { Prisma } from '@prisma/client';
import Service from '.';
import { GetPostsParams } from '@/types/post';
import { CommentData } from '@/types/comment';

class CommentService extends Service {
  constructor() {
    super();
  }

  async getComments(
    user: GetPostsParams,
    postId: string,
    opts?: Prisma.CommentFindManyArgs
  ) {
    const comments = await this.db.comment.findMany({
      where: {
        postId,
      },
      include: this.prismaQueryHelper.getCommentDataInclude(user.id),
      ...opts,
    });

    return comments as CommentData[];
  }
}

export default CommentService;
