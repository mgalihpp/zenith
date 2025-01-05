'use server';

import { createPostSchema } from '@/lib/validation';
import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';
import { CreatePostParams, PostData } from '@/types/post';

export async function SubmitPost(input: CreatePostParams) {
  const { user } = await getSession();

  if (!user) throw new Error('Unauthorized');

  const { content, mediaIds } = createPostSchema.parse(input);

  const newPost = await new PostService().createPost({
    content,
    userId: user.id,
    mediaIds: mediaIds,
  });

  return newPost as PostData;
}
