import { Card, CardContent, CardHeader, CardTitle } from "@quitmate/ui";
import { Users, MessageSquare, TimerReset } from "lucide-react"; // 仮アイコン

const features = [
  {
    title: "同じ依存に特化したコミュニティ",
    icon: Users,
    description:
      "アルコール、ギャンブル、過食、たばこ、SNS、ゲーム、美容整形、買い物、ポルノ、ドラッグ、カフェイン、共依存から選択可能。悩みに合わせて自分に合った仲間とつながれます。",
  },
  {
    title: "投稿で経験を共有・支え合い",
    icon: MessageSquare,
    description:
      "気持ちや進捗を気軽に投稿し、仲間から励ましやアドバイスを受け取れます。実名や顔出しは不要なので、安心して利用できます。",
  },
  {
    title: "離脱時間を記録して可視化",
    icon: TimerReset,
    description:
      "やめ続けている時間を記録することで、小さな成功体験を積み重ね、達成感を得ながら続けられます。",
  },
];

export const Features = () => {
  return (
    <section className="bg-white px-6 py-12 md:py-20">
      <h2 className="mb-4 text-center text-3xl font-semibold text-gray-800 md:mb-12 md:text-4xl">
        3つの特徴
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {features.map(({ title, icon: Icon, description }) => (
          <Card
            key={title}
            className="h-full border-none bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <CardHeader className="flex flex-col items-center gap-2 pb-4">
              <div className="p-2 text-[#2E6C28]">
                <Icon size={48} strokeWidth={1.5} />
              </div>
              <CardTitle className="text-lg font-bold text-gray-800 md:text-xl">
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
