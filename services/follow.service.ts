import Service from '.';

class FollowService extends Service {
  private followerId: string;
  private followingId: string;

  constructor(followerId: string, followingId: string) {
    super();
    this.followerId = followerId;
    this.followingId = followingId;
  }

  async createFollow() {
    await this.db.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: this.followerId,
          followingId: this.followingId,
        },
      },
      create: {
        followerId: this.followerId,
        followingId: this.followingId,
      },
      update: {},
    });
  }

  async deleteFollow() {
    await this.db.follow.deleteMany({
      where: {
        followerId: this.followerId,
        followingId: this.followingId,
      },
    });
  }
}

export default FollowService;
