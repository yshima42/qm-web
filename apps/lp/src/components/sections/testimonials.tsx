// apps/lp/src/components/sections/Testimonials.tsx
import { Card, CardContent } from "@quitmate/ui";

const testimonials = [
  {
    name: "ギャンブルカテゴリ",
    title: "素晴らしいアプリ！",
    message:
      "身内に重度のギャンブル依存症がおります。" +
      "通院も全く効果がなく大変苦労していましたがこのアプリに出会ってから嘘のようにギャンブルをしなくなりました。" +
      "同じような経験をしている方々と励まし合って前向きな気持ちになれているようです。" +
      "家族としても本当に感謝しています。",
  },
  {
    name: "アルコールカテゴリ",
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
    <section className="bg-[#f8fbf7] px-6  py-20 text-center">
      <h2 className="mb-12 text-3xl font-semibold text-gray-800 md:text-4xl">
        ユーザーの声
      </h2>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {testimonials.map((item, index) => (
          <Card
            key={index}
            className="h-full border-none bg-white text-left shadow-md"
          >
            <CardContent className="p-6">
              <div className="mb-4 flex justify-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="size-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="mb-4 text-sm text-gray-600">
                &quot;{item.message}&quot;
              </p>
              <p className="text-right text-sm font-semibold text-gray-700">
                — {item.name}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
