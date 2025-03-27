// apps/lp/src/components/sections/Testimonials.tsx
import { Card, CardContent } from "@quitmate/ui";

const testimonials = [
  {
    name: "禁ギャンブルカテゴリ",
    title: "素晴らしいアプリ！",
    message:
      "身内に重度のギャンブル依存症がおります。" +
      "通院も全く効果がなく大変苦労していましたがこのアプリに出会ってから嘘のようにギャンブルをしなくなりました。" +
      "同じような経験をしている方々と励まし合って前向きな気持ちになれているようです。" +
      "家族としても本当に感謝しています。",
  },
  {
    name: "禁酒カテゴリ",
    title: "再発しても励ましてくれる場所",
    message:
      "とても素敵なアプリです。克服期間が100日を越えている人もいます。皆さんでフォローしあって、方法を考え克服に向けて頑張っています。",
  },
  {
    name: "過食カテゴリ",
    title: "もっと早く知りたかった",
    message:
      "もっと早くこのアプリに出会いたかった。でも早いも遅いもない、このアプリに出会えたことが自分にとってすごく幸運なことだと思っています。",
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-[#f8fbf7] text-center">
      <h2 className="text-3xl md:text-4xl font-semibold mb-12 text-gray-800">
        QuitMateを使ってよかったこと
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((item, index) => (
          <Card
            key={index}
            className="text-left h-full bg-white border-none shadow-md"
          >
            <CardContent className="p-6">
              <div className="flex justify-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                &quot;{item.message}&quot;
              </p>
              <p className="text-sm text-right text-gray-700 font-semibold">
                — {item.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
