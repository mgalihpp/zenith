import FollowButton from '@/components/FollowButton';
import Linkify from '@/components/Linkify';
import Navbar from '@/components/Navbar';
import UserAvatar from '@/components/User/UserAvatar';
import UserTooltip from '@/components/User/UserTooltip';
import PrismaQueryHelper from '@/helpers/prismaQuery';
import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';
import { PostData } from '@/types/post';
import { UserData } from '@/types/user';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cache, Suspense } from 'react';
import SinglePost from './_components/SinglePost';
export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const getPost = cache(async (postId: string, loggedInUserId: string) => {
  const post = await new PostService().getPost(postId, {
    where: {
      id: postId,
    },
    include: new PrismaQueryHelper().getPostsDataInclude(loggedInUserId),
  });

  if (!post) return notFound();

  return post as PostData;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { user } = await getSession();

  const postId = (await params).postId;

  if (!user) return {};

  const post = await getPost(postId, user.id);

  return {
    title: `${post.user.displayName}: ${post.content.slice(0, 50)}...`,
  };
}

export default async function PostPage({ params }: PageProps) {
  const postId = (await params).postId;

  const { user } = await getSession();

  if (!user) return <p>You need to be logged in to view this page</p>;

  const post = await getPost(postId, user.id);

  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar />
        <div className="border sm:rounded-2xl p-1">
          <SinglePost post={post} />
        </div>
      </div>
      <div className="sticky top-[5.25rem] hidden h-fit w-80 flex-none lg:block border rounded-2xl">
        <Suspense fallback={<Loader2 className="animate-spin mx-auto" />}>
          <UserInfoSidebar user={post.user} />
        </Suspense>
      </div>
    </div>
  );
}

interface UserInfoSidebarProps {
  user: UserData;
}

async function UserInfoSidebar({ user }: UserInfoSidebarProps) {
  const { user: loggedInUser } = await getSession();

  if (!loggedInUser) return null;

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="text-xl font-bold">About this user</div>
      <UserTooltip user={user}>
        <Link
          href={`/user/${user.username}`}
          className="flex items-center gap-3"
        >
          <UserAvatar avatarUrl={user.avatarUrl} className="flex-none" />
          <div>
            <p className="line-clamp-1 break-all font-semibold hover:underline">
              {user.displayName}
            </p>
            <p className="line-clamp-1 break-all text-muted-foreground text-xs">
              @{user.username}
            </p>
          </div>
        </Link>
      </UserTooltip>
      <Linkify>
        <div className="line-clamp-6 whitespace-pre-line break-words text-muted-foreground">
          {user.bio}
        </div>
      </Linkify>
      {user.id !== loggedInUser.id && (
        <FollowButton
          userId={user.id}
          initialState={{
            followers: user._count.followers,
            isFollowedByUser: user.followers.some(
              ({ followerId }) => followerId === loggedInUser.id
            ),
          }}
        />
      )}
    </div>
  );
}
