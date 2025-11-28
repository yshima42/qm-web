import { Tabs, TabsContent, TabsList, TabsTrigger } from "@quitmate/ui";
import { useTranslations } from "next-intl";

import { Profile, ProfileTileDto } from "@/lib/types";

import { StoryListInfiniteByUser } from "@/features/stories/ui/story-list-infinite-by-user";
import { StoryListInfiniteCommented } from "@/features/stories/ui/story-list-infinite-commented";
import { ArticleListInfiniteByUser } from "@/features/articles/ui/article-list-infinite-by-user";

type Props = {
  profile: Profile | ProfileTileDto;
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
        <TabsTrigger value="posts">{t("posts")}</TabsTrigger>
        <TabsTrigger value="comments">{t("comments")}</TabsTrigger>
        <TabsTrigger value="articles">{t("articles")}</TabsTrigger>
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
