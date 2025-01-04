import ForYouFeed from '@/components/Feed/ForYourFeed';
import Navbar from '@/components/Navbar';
import TrendSidebar from '@/components/Navbar/TrendSidebar';
import PostEditor from '@/components/Post/Editor/PostEditor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
export const dynamic = 'force-dynamic';

export default function HomePage() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-2">
        <Navbar />
        <PostEditor />
        <Tabs defaultValue="for you">
          <TabsList className="w-full">
            <TabsTrigger className="w-full" value="for you">
              For You
            </TabsTrigger>
            <TabsTrigger className="w-full" value="following">
              Following
            </TabsTrigger>
          </TabsList>
          <TabsContent value="for you" className="border">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">{/*  */}</TabsContent>
        </Tabs>
      </div>
      <TrendSidebar />
    </div>
  );
}
