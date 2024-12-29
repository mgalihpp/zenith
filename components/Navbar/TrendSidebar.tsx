import PrismaQueryHelper from '@/helpers/prismaQuery';
import { db } from '@/lib/prisma';
import { getSession } from '@/services/session.service';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';
import UserTooltip from '@/components/User/UserTooltip';
import Link from 'next/link';
import UserAvatar from '@/components/User/UserAvatar';
import FollowButton from '@/components/FollowButton';
import { unstable_cache } from 'next/cache';
import { formatNumber } from '@/lib/utils';

async function WhoToFollow() {
  const { user } = await getSession();

  if (!user) return null;

  const usersToFollow = await db.user.findMany({
    where: {
      NOT: {
        id: user.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: PrismaQueryHelper.prototype.getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card shadow-sm p-5 border">
      <div className="text-xl font-bold">Who to follow</div>
      {usersToFollow.map((user) => (
        <div key={user.id} className="flex items-center justify-between gap-2">
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
              <div>
                <p className="line-clamp-1 break-all font-semibold hover:underline">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>
          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id
              ),
            }}
          />
        </div>
      ))}
    </div>
  );
}

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await db.$queryRaw<{ hashtag: string; count: bigint }[]>`
  SELECT 
    LOWER(TRIM(SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(content, '\n', ' '), ' ', numbers.n), ' ', -1))) AS hashtag,
    COUNT(*) AS count
FROM (
    SELECT content 
    FROM posts 
    WHERE content REGEXP '#[[:alnum:]_]+'
) AS filtered_posts
JOIN (
    SELECT 1 AS n UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
    UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10
) numbers
ON CHAR_LENGTH(content) - CHAR_LENGTH(REPLACE(REPLACE(content, '\n', ' '), ' ', '')) >= numbers.n - 1
WHERE 
    SUBSTRING_INDEX(SUBSTRING_INDEX(REPLACE(content, '\n', ' '), ' ', numbers.n), ' ', -1) REGEXP '^#[[:alnum:]_]+'
GROUP BY hashtag
ORDER BY count DESC, hashtag ASC
LIMIT 5;

`;

    return result.map((row) => ({
      hashtag: row.hashtag,
      count: Number(row.count),
    }));
  },
  ['trending-topics'],
  {
    revalidate: 1,
  }
);

async function TrendingTopics() {
  const topics = await getTrendingTopics();

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm border">
      <div className="text-xl font-bold">Trending topics</div>
      {topics.map((topic, index) => {
        const title = topic.hashtag.split('#')[1];

        return (
          <Link key={index} href={`/hashtag/${title}`} className="block">
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {topic.hashtag}
            </p>{' '}
            <p className="text-sm text-muted-foreground">
              {formatNumber(topic.count)} {topic.count === 1 ? 'post' : 'posts'}
            </p>
          </Link>
        );
      })}
    </div>
  );
}

export default function TrendSidebar() {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense fallback={<Loader2 className="mx-auto animate-spin" />}>
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
}
