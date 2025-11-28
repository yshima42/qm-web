import { Tabs, TabsContent, TabsList, TabsTrigger } from "@quitmate/ui";

import { Profile, ProfileTileDto } from "@/lib/types";

import { StoryListInfiniteByUser } from "@/features/stories/ui/story-list-infinite-by-user";
import { StoryListInfiniteCommented } from "@/features/stories/ui/story-list-infinite-commented";

type Props = {
  profile: Profile | ProfileTileDto;
  isLoggedIn: boolean;
};

export function ProfileTabs({ profile, isLoggedIn }: Props) {
  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="posts">Posts</TabsTrigger>
        <TabsTrigger value="comments">Comments</TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <StoryListInfiniteByUser userId={profile.id} isLoggedIn={isLoggedIn} />
      </TabsContent>
      <TabsContent value="comments">
        <StoryListInfiniteCommented userId={profile.id} isLoggedIn={isLoggedIn} />
      </TabsContent>
    </Tabs>
  );
}
