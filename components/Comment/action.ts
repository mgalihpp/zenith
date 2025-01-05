'use server';

import { db } from '@/lib/prisma';
import { createCommentSchema } from '@/lib/validation';
import CommentService from '@/services/comment.service';
import NotificationService from '@/services/notification.service';
import { getSession } from '@/services/session.service';
import { CreateCommentParams } from '@/types/post';

export async function SubmitComment(input: CreateCommentParams) {
  const { user } = await getSession();

  if (!user) throw new Error('Unauthorized');

  const { content } = createCommentSchema.parse(input);

  const notificationService = new NotificationService();

  const [newComment] = await db.$transaction(async () => {
    return await Promise.all([
      await new CommentService().createComment({
        content,
        userId: user.id,
        postId: input.post.id,
      }),
      ...(input.post.user.id !== user.id
        ? [
            await notificationService.createNotification(
              user.id,
              input.post.userId,
              'COMMENT',
              input.post.id
            ),
          ]
        : []),
    ]);
  });

  return newComment;
}

export async function DeleteComment(commentId: string) {
  const { user } = await getSession();

  if (!user) throw new Error('Unauthorized');

  const comment = await new CommentService().getComment(commentId);

  if (!comment) throw new Error('Comment not found');

  if (comment.userId !== user.id) throw new Error('Unauthorized');

  const deletedComment = await new CommentService().deleteComment(
    commentId,
    user.id
  );

  return deletedComment;
}
