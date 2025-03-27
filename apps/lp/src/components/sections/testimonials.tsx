// apps/lp/src/components/sections/Testimonials.tsx
import { Card, CardContent } from "@quitmate/ui";

const testimonials = [
  {
    name: "30代・男性（アルコール）",
    message:
      "毎日飲まないと眠れなかったけど、QuitMateで同じ悩みの人と話すことで少しずつ落ち着いてきました。",
  },
  {
    name: "20代・女性（ギャンブル）",
    message:
      "やめようとしても戻ってしまう毎日だったけど、投稿や応援コメントに何度も救われました。",
  },
  {
    name: "40代・男性（たばこ）",
    message:
      "1週間吸わないだけでもすごい！って言ってくれる仲間がいて、続けられる自信になっています。",
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
