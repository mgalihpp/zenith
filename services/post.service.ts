import { GetPostsParams, PostData } from '@/types/post';
import { Prisma } from '@prisma/client';
import Service from '.';

class PostService extends Service {
  constructor() {
    super();
  }

  async getPosts(user: GetPostsParams, opts?: Prisma.PostFindManyArgs) {
    const posts = await this.db.post.findMany({
      include: this.prismaQueryHelper.getPostsDataInclude(user?.id),
      ...opts,
    });

    return posts as PostData[];
  }
}

export default PostService;
