import Service from '.';

class LikeService extends Service {
  private userId: string;
  private postId: string;

  constructor(userId: string, postId: string) {
    super();
    this.userId = userId;
    this.postId = postId;
  }

  async createLike() {
    await this.db.like.upsert({
      where: {
        userId_postId: {
          userId: this.userId,
          postId: this.postId,
        },
      },
      create: {
        userId: this.userId,
        postId: this.postId,
      },
      update: {},
    });
  }

  async deleteLike() {
    await this.db.like.deleteMany({
      where: {
        userId: this.userId,
        postId: this.postId,
      },
    });
  }
}

export default LikeService;
