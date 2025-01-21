import Navbar from '@/components/Navbar';
import TrendSidebar from '@/components/Navbar/TrendSidebar';
import Post from '@/components/Post/Post';
import PostService from '@/services/post.service';
import { getSession } from '@/services/session.service';
import { PostData } from '@/types/post';

export const dynamic = 'force-dynamic';

type PageProps = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPostByHastag(tag: string): Promise<PostData[] | []> {
  try {
    const postServices = new PostService();
    const { user } = await getSession();

    if (!user) return [];

    const posts = postServices.getPosts(user, {
      where: {
        content: {
          contains: tag,
        },
      },
    });

    return posts;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function HashtagPage({ params }: PageProps) {
  const { tag } = await params;

  const posts = await getPostByHastag(tag);

  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar title="Hashtag" />
        <div className="border p-1 sm:rounded-2xl">
          <div className="divide-y">
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
      <TrendSidebar />
    </div>
  );
}
