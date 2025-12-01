import { Tabs, TabsContent, TabsList, TabsTrigger } from "@quitmate/ui";
import { useTranslations } from "next-intl";

import { ProfileTileDto } from "@/lib/types";

import { StoryListInfiniteByUser } from "@/features/stories/ui/story-list-infinite-by-user";
import { StoryListInfiniteCommented } from "@/features/stories/ui/story-list-infinite-commented";
import { ArticleListInfiniteByUser } from "@/features/articles/ui/article-list-infinite-by-user";

type Props = {
  profile: ProfileTileDto;
  isLoggedIn: boolean;
  /** プロフィールのユーザーがミュートされているかどうか */
  isMuted?: boolean;
  currentUserId?: string;
};

export function ProfileTabs({ profile, isLoggedIn, isMuted = false, currentUserId }: Props) {
  const t = useTranslations("profile-tabs");

  return (
    <Tabs defaultValue="posts" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger
          value="posts"
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:font-semibold"
        >
          {t("posts")}
        </TabsTrigger>
        <TabsTrigger
          value="comments"
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:font-semibold"
        >
          {t("comments")}
        </TabsTrigger>
        <TabsTrigger
          value="articles"
          className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:border-b-2 data-[state=active]:font-semibold"
        >
          {t("articles")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="posts">
        <StoryListInfiniteByUser
          userId={profile.id}
          isLoggedIn={isLoggedIn}
          isMutedOwner={isMuted}
          currentUserId={currentUserId}
        />
      </TabsContent>
      <TabsContent value="comments">
        <StoryListInfiniteCommented
          userId={profile.id}
          isLoggedIn={isLoggedIn}
          currentUserId={currentUserId}
        />
      </TabsContent>
      <TabsContent value="articles">
        <ArticleListInfiniteByUser userId={profile.id} isLoggedIn={isLoggedIn} />
      </TabsContent>
    </Tabs>
  );
}
