import ForYouFeed from '@/components/Feed/ForYourFeed';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function HomePage() {
  return (
    <div className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <Tabs defaultValue="for you">
          <TabsList>
            <TabsTrigger value="for you">For You</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          <TabsContent value="for you">
            <ForYouFeed />
          </TabsContent>
          <TabsContent value="following">{/*  */}</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
