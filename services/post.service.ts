import PrismaQueryHelper from '@/helpers/prismaQuery';
import { db } from '@/lib/prisma';
import { GetPostsParams, PostData } from '@/types/post';
import { Prisma, PrismaClient } from '@prisma/client';

class PostService {
  private prismaQueryHelper: PrismaQueryHelper;
  private db: PrismaClient;

  constructor() {
    this.prismaQueryHelper = new PrismaQueryHelper();
    this.db = db;
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
