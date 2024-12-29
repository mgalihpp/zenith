'use server';

import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';

export default async function DeletePost(postId: string) {
  const { user } = await getSession();

  if (!user) throw new Error('Unauthorized');

  const post = await new PostService().getPost(postId);

  if (!post) throw new Error('Post not found');

  if (post.userId !== user.id) throw new Error('Unauthorized');

  const deletedPost = await new PostService().deletePost(postId, user.id);

  return deletedPost;
}
