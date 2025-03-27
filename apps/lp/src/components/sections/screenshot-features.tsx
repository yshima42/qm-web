// apps/lp/src/components/sections/ScreenshotFeatures.tsx
import Image from "next/image";

const features = [
  {
    title: "自分に合ったコミュニティを選べる",
    description:
      "アルコールやギャンブルなど、自分の依存傾向に合ったコミュニティで仲間とつながれます。",
    image: "/images/feature1.svg",
    imagePosition: "left",
  },
  {
    title: "気持ちを投稿して支え合う",
    description:
      "感じたこと、頑張ったことを投稿すれば、他のユーザーから共感や応援のコメントが届きます。",
    image: "/images/feature2.svg",
    imagePosition: "right",
  },
  {
    title: "やめ続けている時間を記録",
    description:
      "やめた時間を可視化できるトラッカー機能で、小さな成功体験を積み重ねられます。",
    image: "/images/feature3.svg",
    imagePosition: "left",
  },
];

export const ScreenshotFeatures = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-[#f8fbf7]">
      <h2 className="text-3xl md:text-4xl font-semibold text-center mb-12 text-gray-800">
        QuitMateでできること
      </h2>
      <div className="space-y-24">
        {features.map((feature) => (
          <div
            key={feature.title}
            className={`flex flex-col ${
              feature.imagePosition === "left"
                ? "md:flex-row"
                : "md:flex-row-reverse"
            } items-center gap-8 max-w-6xl mx-auto`}
          >
            <div className="w-full md:w-5/12">
              <Image
                src={feature.image}
                alt={feature.title}
                width={400}
                height={400}
                className="rounded-xl shadow-lg mx-auto"
              />
            </div>
            <div className="w-full md:w-7/12 text-left">
              <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
