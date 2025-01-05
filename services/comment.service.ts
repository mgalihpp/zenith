import { Prisma } from '@prisma/client';
import Service from '.';
import { GetPostsParams } from '@/types/post';
import { CommentData } from '@/types/comment';

class CommentService extends Service {
  constructor() {
    super();
  }

  async createComment(params: {
    content: string;
    userId: string;
    postId: string;
  }) {
    const newComment = await this.db.comment.create({
      data: {
        content: params.content,
        userId: params.userId,
        postId: params.postId,
      },
      include: this.prismaQueryHelper.getCommentDataInclude(params.userId),
    });

    return newComment;
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

  async getComment(commentId: string, opts?: Prisma.CommentFindUniqueArgs) {
    const comment = await this.db.comment.findUnique({
      where: {
        id: commentId,
      },
      ...opts,
    });

    return comment;
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.db.comment.delete({
      where: {
        id: commentId,
      },
      include: this.prismaQueryHelper.getCommentDataInclude(userId),
    });

    return comment;
  }
}

export default CommentService;
