import TrendSidebar from '@/components/Navbar/TrendSidebar';
import Bookmarks from './_components/Bookmarks';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your Bookmarks',
  description: 'A list of your bookmarked posts.',
};

export default function BookmarksPage() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar title="Bookmarks" />
        <Bookmarks />
      </div>
      <TrendSidebar />
    </div>
  );
}
