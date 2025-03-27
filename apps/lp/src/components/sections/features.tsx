import { Card, CardContent, CardHeader, CardTitle } from "@quitmate/ui";
import { Users, MessageSquare, TimerReset } from "lucide-react"; // 仮アイコン

const features = [
  {
    title: "同じ依存に特化したコミュニティ",
    icon: Users,
    description:
      "アルコールやギャンブル、たばこなど、悩みに合わせて自分に合った仲間とつながれます。",
  },
  {
    title: "投稿で経験を共有・支え合い",
    icon: MessageSquare,
    description:
      "感じたこと、苦しかったことを投稿でき、共感や応援の声が届きます。",
  },
  {
    title: "離脱時間を記録して可視化",
    icon: TimerReset,
    description:
      "やめ続けている時間を記録することで、小さな成功体験を積み重ねられます。",
  },
];

export const Features = () => {
  return (
    <section className="bg-white px-6 py-20">
      <h2 className="mb-12 text-center text-3xl font-semibold text-gray-800 md:text-4xl">
        QuitMateの3つの特徴
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {features.map(({ title, icon: Icon, description }) => (
          <Card
            key={title}
            className="h-full border-none bg-white shadow-md transition-shadow hover:shadow-lg"
          >
            <CardHeader className="flex items-center gap-4">
              <div className="p-2 text-[#2E6C28]">
                <Icon size={40} strokeWidth={1.5} />
              </div>
              <CardTitle className="text-gray-800">{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
