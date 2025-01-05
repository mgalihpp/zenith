import Navbar from '@/components/Navbar';
import TrendSidebar from '@/components/Navbar/TrendSidebar';
import { Metadata } from 'next';
import SearchResult from './_components/SearchResult';

type PageProps = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams;

  return {
    title: `Search results for "${q}"`,
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;

  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar />
        <div className="border p-1 rounded-2xl">
          <SearchResult q={q as string} />
        </div>
      </div>
      <TrendSidebar />
    </div>
  );
}
