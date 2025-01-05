import TrendSidebar from '@/components/Navbar/TrendSidebar';
import PrismaQueryHelper from '@/helpers/prismaQuery';
import { getSession } from '@/services/session.service';
import UserService from '@/services/user.service';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import UserProfile from './_components/UserProfile';
import { UserData } from '@/types/user';
import Navbar from '@/components/Navbar';
import UserPosts from './_components/UserPosts';

type PageProps = {
  params: Promise<{ username: string }>;
};

const getUser = cache(async (username: string, loggedInUserId: string) => {
  const user = await new UserService().getUsersByUsername(username, {
    select: new PrismaQueryHelper().getUserDataSelect(loggedInUserId),
  });

  if (!user) return notFound();

  return user as unknown as UserData;
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;
  const { user: loggedInUser } = await getSession();

  if (!loggedInUser) return {};

  const user = await getUser(username, loggedInUser.id);

  return {
    title: `${user.displayName} (@${user.username})`,
  };
}

export default async function UserPage({ params }: PageProps) {
  const { username } = await params;
  const { user: loggedInUser } = await getSession();

  if (!loggedInUser) {
    return (
      <p className="text-destructive">
        You&apos;re not authorized to view this page.
      </p>
    );
  }

  const user = await getUser(username, loggedInUser.id);

  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar />
        <div className="border p-1 rounded-2xl">
          <div className="border-b pb-4 mb-2">
            <UserProfile user={user} loggedInUserId={loggedInUser.id} />
          </div>
          <div>
            <UserPosts userId={user.id} />
          </div>
        </div>
      </div>
      <TrendSidebar />
    </div>
  );
}
